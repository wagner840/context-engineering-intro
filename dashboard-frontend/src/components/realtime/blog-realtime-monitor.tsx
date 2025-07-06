"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  Database,
  FileText,
  Globe,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RealtimeEvent {
  id: string;
  type: "insert" | "update" | "delete";
  table: string;
  record: any;
  timestamp: string;
  blogId?: string;
  blogName?: string;
}

interface BlogRealtimeMonitorProps {
  blogId?: string;
  showAllBlogs?: boolean;
}

export function BlogRealtimeMonitor({
  blogId,
  showAllBlogs = false,
}: BlogRealtimeMonitorProps) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [blogs, setBlogs] = useState<
    Map<string, { name: string; domain: string }>
  >(new Map());

  useEffect(() => {
    // Buscar informações dos blogs
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("id, name, domain")
        .eq("is_active", true);

      if (data) {
        const blogsMap = new Map(
          data.map((blog) => [
            blog.id,
            { name: blog.name, domain: blog.domain },
          ])
        );
        setBlogs(blogsMap);
      }
    };

    fetchBlogs();

    // Configurar subscriptions
    const channels: any[] = [];

    // Posts changes
    const postsChannel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "content_posts",
          filter: blogId ? `blog_id=eq.${blogId}` : undefined,
        },
        (payload) => {
          const blog = blogs.get((payload as any).new?.blog_id || (payload as any).old?.blog_id);
          addEvent({
            type: payload.eventType as any,
            table: "content_posts",
            record: payload.new || payload.old,
            blogId: (payload as any).new?.blog_id || (payload as any).old?.blog_id,
            blogName: blog?.name,
          });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    channels.push(postsChannel);

    // Keywords changes
    const keywordsChannel = supabase
      .channel("keywords-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "main_keywords",
          filter: blogId ? `blog_id=eq.${blogId}` : undefined,
        },
        (payload) => {
          const blog = blogs.get((payload as any).new?.blog_id || (payload as any).old?.blog_id);
          addEvent({
            type: payload.eventType as any,
            table: "main_keywords",
            record: payload.new || payload.old,
            blogId: (payload as any).new?.blog_id || (payload as any).old?.blog_id,
            blogName: blog?.name,
          });
        }
      )
      .subscribe();

    channels.push(keywordsChannel);

    // Opportunities changes
    const opportunitiesChannel = supabase
      .channel("opportunities-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "content_opportunities_clusters",
          filter: blogId ? `blog_id=eq.${blogId}` : undefined,
        },
        (payload) => {
          const blog = blogs.get((payload as any).new?.blog_id || (payload as any).old?.blog_id);
          addEvent({
            type: payload.eventType as any,
            table: "content_opportunities",
            record: payload.new || payload.old,
            blogId: (payload as any).new?.blog_id || (payload as any).old?.blog_id,
            blogName: blog?.name,
          });
        }
      )
      .subscribe();

    channels.push(opportunitiesChannel);

    // Media changes
    const mediaChannel = supabase
      .channel("media-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "media_assets",
          filter: blogId ? `blog_id=eq.${blogId}` : undefined,
        },
        (payload) => {
          const blog = blogs.get((payload as any).new?.blog_id || (payload as any).old?.blog_id);
          addEvent({
            type: payload.eventType as any,
            table: "media_assets",
            record: payload.new || payload.old,
            blogId: (payload as any).new?.blog_id || (payload as any).old?.blog_id,
            blogName: blog?.name,
          });
        }
      )
      .subscribe();

    channels.push(mediaChannel);

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [blogId, blogs]);

  const addEvent = (event: Omit<RealtimeEvent, "id" | "timestamp">) => {
    setEvents((prev) =>
      [
        {
          ...event,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 50)
    ); // Keep last 50 events
  };

  const getEventIcon = (table: string) => {
    switch (table) {
      case "content_posts":
        return <FileText className="h-4 w-4" />;
      case "main_keywords":
        return <Database className="h-4 w-4" />;
      case "content_opportunities":
        return <Zap className="h-4 w-4" />;
      case "media_assets":
        return <Globe className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "INSERT":
        return "text-green-600";
      case "UPDATE":
        return "text-blue-600";
      case "DELETE":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getEventDescription = (event: RealtimeEvent) => {
    const action =
      event.type === "insert"
        ? "criado"
        : event.type === "update"
          ? "atualizado"
          : "removido";

    switch (event.table) {
      case "content_posts":
        return `Post "${event.record.title || "Sem título"}" ${action}`;
      case "main_keywords":
        return `Keyword "${event.record.keyword}" ${action}`;
      case "content_opportunities":
        return `Oportunidade "${event.record.title}" ${action}`;
      case "media_assets":
        return `Mídia "${event.record.filename}" ${action}`;
      default:
        return `Registro ${action} em ${event.table}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Monitor em Tempo Real</CardTitle>
            <CardDescription>
              Acompanhe as alterações nos seus blogs ao vivo
            </CardDescription>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Conectando...
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {events.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aguardando eventos em tempo real...
            </AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className={`mt-0.5 ${getEventColor(event.type)}`}>
                    {getEventIcon(event.table)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {getEventDescription(event)}
                    </p>

                    {showAllBlogs && event.blogName && (
                      <p className="text-xs text-muted-foreground">
                        Blog: {event.blogName}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(event.timestamp), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>

                  <Badge
                    variant={
                      event.type === "insert"
                        ? "default"
                        : event.type === "update"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {events.length > 0 && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando últimos {events.length} eventos
            </p>
            <Badge variant="outline" className="text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Auto-refresh
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
