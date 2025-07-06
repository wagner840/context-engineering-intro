import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, ExternalLink } from "lucide-react";

interface MobileOptimizedCardProps {
  title: string;
  description?: string;
  status?: "active" | "inactive" | "error" | "warning";
  statusText?: string;
  metrics?: Array<{
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
    icon?: React.ReactNode;
  }>;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  error: "bg-red-100 text-red-800 border-red-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export function MobileOptimizedCard({
  title,
  description,
  status,
  statusText,
  metrics,
  actions,
  href,
  className,
  children,
}: MobileOptimizedCardProps) {
  const CardWrapper = ({
    children: cardChildren,
  }: {
    children: React.ReactNode;
  }) => {
    if (href) {
      return (
        <a href={href} className="block">
          <Card
            className={cn(
              "transition-all duration-200 hover:shadow-md cursor-pointer",
              "active:scale-[0.98] hover:scale-[1.02]",
              className
            )}
          >
            {cardChildren}
          </Card>
        </a>
      );
    }

    return (
      <Card className={cn("transition-all duration-200", className)}>
        {cardChildren}
      </Card>
    );
  };

  return (
    <CardWrapper>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold leading-tight truncate">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1 text-sm line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {status && (
              <Badge
                variant="outline"
                className={cn("text-xs px-2 py-1", statusColors[status])}
              >
                {statusText || status}
              </Badge>
            )}

            {href && <ExternalLink className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
      </CardHeader>

      {(metrics || children) && (
        <CardContent className="pt-0">
          {metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="text-center p-2 bg-gray-50 rounded-lg"
                >
                  <div className="text-lg sm:text-xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {metric.label}
                  </div>
                  {metric.trend && (
                    <div
                      className={cn(
                        "text-xs mt-1",
                        metric.trend === "up" && "text-green-600",
                        metric.trend === "down" && "text-red-600",
                        metric.trend === "neutral" && "text-gray-600"
                      )}
                    >
                      {metric.trend === "up" && "↗ Alta"}
                      {metric.trend === "down" && "↘ Baixa"}
                      {metric.trend === "neutral" && "→ Estável"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {children && <div className="mb-4">{children}</div>}

          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.slice(0, 2).map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={action.onClick}
                  className="flex-1 min-w-0 sm:flex-none"
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  <span className="truncate">{action.label}</span>
                </Button>
              ))}

              {actions.length > 2 && (
                <Button variant="ghost" size="sm" className="px-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      )}
    </CardWrapper>
  );
}

// Componente específico para blogs
export function BlogCard({
  blog,
  stats,
  onEdit,
  onSync,
}: {
  blog: {
    id: string;
    name: string;
    domain: string;
    description: string | null | undefined;
    is_active: boolean;
  };
  stats?: {
    totalPosts: number;
    publishedPosts: number;
    totalKeywords: number;
    usedKeywords: number;
  };
  onEdit?: () => void;
  onSync?: () => void;
}) {
  return (
    <MobileOptimizedCard
      title={blog.name}
      description={blog.description || blog.domain}
      status={blog.is_active ? "active" : "inactive"}
      statusText={blog.is_active ? "Ativo" : "Inativo"}
      href={`/blogs/${blog.id}`}
      metrics={
        stats
          ? [
              { label: "Posts", value: stats.totalPosts },
              { label: "Publicados", value: stats.publishedPosts },
              { label: "Keywords", value: stats.totalKeywords },
              { label: "Usadas", value: stats.usedKeywords },
            ]
          : undefined
      }
      actions={[
        ...(onEdit ? [{ label: "Editar", onClick: onEdit }] : []),
        ...(onSync ? [{ label: "Sincronizar", onClick: onSync }] : []),
      ]}
    />
  );
}

// Componente específico para posts
export function PostCard({
  post,
  onEdit,
  onView,
}: {
  post: {
    id: string;
    title: string;
    excerpt?: string;
    status: string;
    word_count?: number;
    reading_time?: number;
    seo_score?: number;
    published_at?: string;
  };
  onEdit?: () => void;
  onView?: () => void;
}) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "publish":
        return { status: "active" as const, text: "Publicado" };
      case "draft":
        return { status: "warning" as const, text: "Rascunho" };
      case "private":
        return { status: "inactive" as const, text: "Privado" };
      default:
        return { status: "inactive" as const, text: status };
    }
  };

  const statusInfo = getStatusInfo(post.status);

  return (
    <MobileOptimizedCard
      title={post.title}
      description={post.excerpt}
      status={statusInfo.status}
      statusText={statusInfo.text}
      metrics={[
        { label: "Palavras", value: post.word_count || 0 },
        { label: "Leitura", value: `${post.reading_time || 0}min` },
        { label: "SEO", value: `${post.seo_score || 0}%` },
      ]}
      actions={[
        { label: "Editar", onClick: onEdit || (() => {}), variant: "outline" },
        { label: "Ver", onClick: onView || (() => {}), variant: "ghost" },
      ]}
    />
  );
}

// Componente específico para keywords
export function KeywordCard({
  keyword,
  onEdit,
  onUse,
}: {
  keyword: {
    id: string;
    keyword: string;
    msv?: number;
    kw_difficulty?: number;
    cpc?: number;
    competition?: string;
    is_used: boolean;
    search_intent?: string;
  };
  onEdit?: () => void;
  onUse?: () => void;
}) {
  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return "neutral";
    if (difficulty < 30) return "up";
    if (difficulty > 70) return "down";
    return "neutral";
  };

  return (
    <MobileOptimizedCard
      title={keyword.keyword}
      description={keyword.search_intent}
      status={keyword.is_used ? "active" : "inactive"}
      statusText={keyword.is_used ? "Usada" : "Disponível"}
      metrics={[
        { label: "Volume", value: keyword.msv || 0 },
        {
          label: "Dificuldade",
          value: `${keyword.kw_difficulty || 0}%`,
          trend: getDifficultyColor(keyword.kw_difficulty),
        },
        { label: "CPC", value: `$${(keyword.cpc || 0).toFixed(2)}` },
      ]}
      actions={[
        {
          label: keyword.is_used ? "Editar" : "Usar",
          onClick: keyword.is_used ? onEdit || (() => {}) : onUse || (() => {}),
          variant: keyword.is_used ? "outline" : "default",
        },
      ]}
    />
  );
}
