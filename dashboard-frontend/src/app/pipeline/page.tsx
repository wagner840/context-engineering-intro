"use client";

import { useState } from 'react'
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { 
  Workflow, 
  Play, 
  Settings, 
  Plus, 
  Clock,
  Zap,
  FileText,
  Brain,
  BarChart3,
  Calendar
} from 'lucide-react'
import {
  useProductionPipeline,
  useUpdatePostStatus,
} from "@/hooks/use-content";
import { ContentPipelineOverview } from '@/components/pipeline/content-pipeline-overview'
import { WorkflowBuilder } from '@/components/pipeline/workflow-builder'
import { PipelineTemplates } from '@/components/pipeline/pipeline-templates'
import { ContentScheduler } from '@/components/pipeline/content-scheduler'
import { formatDate } from "@/lib/utils";
import { Post } from "@/types/database";

const STATUSES = [
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
] as const;

type Status = (typeof STATUSES)[number];

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { data: items = [], isLoading, error } = useProductionPipeline();
  const updateStatus = useUpdatePostStatus();

  const grouped: Record<Status, Post[]> = {
    draft: [],
    review: [],
    scheduled: [],
    published: [],
    archived: [],
  };
  items.forEach((p: any) => {
    grouped[p.status as Status]?.push(p);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pipeline de Conteúdo
        </h1>
        <p className="text-gray-600">
          Automatize seu fluxo de criação de conteúdo integrando WordPress, n8n e IA
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Workflow className="h-4 w-4 text-blue-600" />
              Workflows Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600">3 rodando agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-green-600" />
              Posts Gerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.filter((i: any) => i.status === 'published').length}</div>
            <p className="text-xs text-gray-600">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-600" />
              Agendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.filter((i: any) => i.status === 'scheduled').length}</div>
            <p className="text-xs text-gray-600">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-purple-600" />
              Em Revisão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.filter((i: any) => i.status === 'review').length}</div>
            <p className="text-xs text-gray-600">Aguardando aprovação</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendador
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Kanban
            </TabsTrigger>
          </TabsList>

          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Workflow
          </Button>
        </div>

        <TabsContent value="overview">
          <ContentPipelineOverview />
        </TabsContent>

        <TabsContent value="workflows">
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="templates">
          <PipelineTemplates />
        </TabsContent>

        <TabsContent value="scheduler">
          <ContentScheduler />
        </TabsContent>

        <TabsContent value="kanban">
          {/* Kanban Board - Legacy Content */}
          {isLoading ? (
            <div className="p-6">Carregando pipeline...</div>
          ) : error ? (
            <div className="p-6 text-red-600">Erro: {(error as Error).message}</div>
          ) : (
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
                          {(post as any).blog_name || 'Blog'} • {formatDate(post.created_at)}
                        </p>

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
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Pipeline Inteligente</h3>
            <p className="text-blue-700 text-sm">
              Use IA para gerar conteúdo automaticamente baseado nas suas keywords e tendências
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Brain className="h-4 w-4 mr-2" />
              Configurar IA
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Iniciar Pipeline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
