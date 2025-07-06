"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Activity,
  FileText,
  Database,
  Globe,
  Plus,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { N8nService } from "@/lib/services/n8n-service";
import { useRouter } from "next/navigation";

interface WorkflowCardProps {
  workflow: any;
  onToggle: (id: string, active: boolean) => void;
  onTrigger: (id: string) => void;
}

function WorkflowCard({ workflow, onToggle, onTrigger }: WorkflowCardProps) {
  const getWorkflowIcon = (name: string) => {
    if (name.toLowerCase().includes("sync"))
      return <RefreshCw className="h-4 w-4" />;
    if (name.toLowerCase().includes("content"))
      return <FileText className="h-4 w-4" />;
    if (name.toLowerCase().includes("keyword"))
      return <Database className="h-4 w-4" />;
    if (name.toLowerCase().includes("serp"))
      return <Globe className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              {getWorkflowIcon(workflow.name)}
            </div>
            <div>
              <CardTitle className="text-lg">{workflow.name}</CardTitle>
              <CardDescription className="text-xs">
                ID: {workflow.id}
              </CardDescription>
            </div>
          </div>
          <Badge variant={workflow.active ? "default" : "secondary"}>
            {workflow.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Atualizado{" "}
            {formatDistanceToNow(new Date(workflow.updatedAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>

        {workflow.tags && workflow.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {workflow.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={workflow.active ? "destructive" : "default"}
            onClick={() => onToggle(workflow.id, !workflow.active)}
            className="flex-1"
          >
            {workflow.active ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Desativar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Ativar
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onTrigger(workflow.id)}
            disabled={!workflow.active}
          >
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExecutionsList({ workflowId }: { workflowId?: string }) {
  const n8nService = new N8nService();

  const { data: executions, isLoading } = useQuery({
    queryKey: ["n8n-executions", workflowId],
    queryFn: () =>
      n8nService.getExecutions({
        workflowId,
        limit: 20,
      }),
    refetchInterval: 10000, // Refresh every 10s
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!executions?.data || executions.data.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Nenhuma execução encontrada</AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3 pr-4">
        {executions.data.map((execution: any) => (
          <div
            key={execution.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded ${
                  execution.status === "success"
                    ? "bg-green-100"
                    : execution.status === "error"
                      ? "bg-red-100"
                      : execution.status === "running"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                }`}
              >
                {execution.status === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : execution.status === "error" ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : execution.status === "running" ? (
                  <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-600" />
                )}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {execution.workflowData?.name || "Workflow"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(execution.startedAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {execution.stoppedAt && (
                <Badge variant="outline" className="text-xs">
                  {Math.round(
                    (new Date(execution.stoppedAt).getTime() -
                      new Date(execution.startedAt).getTime()) /
                      1000
                  )}
                  s
                </Badge>
              )}

              <Badge
                variant={
                  execution.status === "success"
                    ? "default"
                    : execution.status === "error"
                      ? "destructive"
                      : "secondary"
                }
              >
                {execution.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function N8nDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const n8nService = new N8nService();
  const [selectedWorkflow] = useState<
    string | undefined
  >();

  // Buscar workflows
  const {
    data: workflows,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["n8n-workflows"],
    queryFn: () => n8nService.getWorkflows({ limit: 100 }),
    refetchInterval: 30000, // Refresh every 30s
  });

  // Mutation para toggle workflow
  const toggleWorkflowMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => {
      return active
        ? n8nService.activateWorkflow(id)
        : n8nService.deactivateWorkflow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["n8n-workflows"] });
    },
  });

  // Estatísticas
  const stats = {
    total: workflows?.data?.length || 0,
    active: workflows?.data?.filter((w: any) => w.active).length || 0,
    inactive: workflows?.data?.filter((w: any) => !w.active).length || 0,
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao conectar com N8N. Verifique se o servidor está online.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">N8N Automation</h2>
          <p className="text-muted-foreground">
            Gerencie seus workflows de automação
          </p>
        </div>
        <Button onClick={() => router.push("/automation/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workflows
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Execuções</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-muted/20 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workflows?.data?.map((workflow: any) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onToggle={(id, active) =>
                    toggleWorkflowMutation.mutate({ id, active })
                  }
                  onTrigger={(id) => {
                    // TODO: Implement trigger
                    alert(`Triggering workflow ${id}`);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execuções Recentes</CardTitle>
              <CardDescription>
                Histórico de execuções dos workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExecutionsList workflowId={selectedWorkflow} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(n8nService.getWorkflowTemplates()).map(
              ([key, template]) => (
                <Card key={key} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        <span>{template.nodes.length} nodes</span>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => {
                          // TODO: Implement template creation
                          alert(
                            `Creating workflow from template: ${template.name}`
                          );
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
