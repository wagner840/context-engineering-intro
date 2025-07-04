"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useProductionPipeline,
  useUpdatePostStatus,
} from "@/hooks/use-content";
import { formatDate } from "@/lib/utils";

const STATUSES = [
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
] as const;

type Status = (typeof STATUSES)[number];

export default function PipelinePage() {
  const { data: items = [], isLoading, error } = useProductionPipeline();
  const updateStatus = useUpdatePostStatus();

  const grouped: Record<Status, any[]> = {
    draft: [],
    review: [],
    scheduled: [],
    published: [],
    archived: [],
  };
  items.forEach((p: any) => {
    grouped[p.status as Status]?.push(p);
  });

  if (isLoading) {
    return <p className="p-6">Carregando pipeline...</p>;
  }
  if (error) {
    return (
      <p className="p-6 text-destructive">Erro: {(error as Error).message}</p>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Pipeline de Conteúdo</h1>
      <div className="grid gap-4 md:grid-cols-5">
        {STATUSES.map((status) => (
          <Card key={status} className="min-h-[60vh] flex flex-col">
            <CardHeader>
              <CardTitle className="capitalize flex items-center justify-between">
                {status}
                <Badge variant="outline">{grouped[status].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 overflow-y-auto">
              {grouped[status].length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum post</p>
              )}
              {grouped[status].map((post) => (
                <div
                  key={post.id}
                  className="p-3 rounded-lg border shadow-sm bg-card space-y-2"
                >
                  <Link
                    href={`/blogs/${post.blog_id}/posts/${post.id}/edit`}
                    className="font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {post.blog_name} • {formatDate(post.created_at)}
                  </p>

                  {/* Status selector */}
                  <Select
                    value={post.status}
                    onValueChange={(value: Status) => {
                      updateStatus.mutate({ id: post.id, status: value });
                    }}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem value={s} key={s} className="capitalize">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
