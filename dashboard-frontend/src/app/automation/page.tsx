"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, StopCircle, RefreshCw, Zap } from "lucide-react";
import {
  useWorkflows,
  useN8nHealth,
  useExecutions,
  useActivateWorkflow,
  useDeactivateWorkflow,
  useExecuteWorkflow,
} from "@/hooks/use-automation";
import { formatDate } from "@/lib/utils";

export default function AutomationPage() {
  const { data: health, isLoading: healthLoading } = useN8nHealth();
  const { data: workflows = [], isLoading: workflowsLoading } = useWorkflows();
  const { data: executions = [], isLoading: execLoading } = useExecutions({
    limit: 25,
  }) as any;

  const activate = useActivateWorkflow();
  const deactivate = useDeactivateWorkflow();
  const execute = useExecuteWorkflow();

  const [tab, setTab] = useState<"workflows" | "executions">("workflows");

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6" /> Automation
        </h1>
        {healthLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <Badge variant={health?.healthy ? "default" : "destructive"}>
            {health?.healthy ? "Online" : "Offline"}
          </Badge>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Execuções</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "workflows" ? (
        <Card>
          <CardHeader>
            <CardTitle>Workflows n8n</CardTitle>
            <CardDescription>
              Gerencie, ative e execute workflows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workflowsLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflows.map((wf: any) => (
                      <TableRow key={wf.id}>
                        <TableCell className="font-medium">{wf.name}</TableCell>
                        <TableCell>
                          <Badge variant={wf.active ? "success" : "secondary"}>
                            {wf.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(wf.createdAt)}</TableCell>
                        <TableCell className="space-x-2">
                          {wf.active ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deactivate.mutate(wf.id)}
                              disabled={deactivate.isLoading}
                            >
                              <StopCircle className="h-4 w-4 mr-1" /> Desativar
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => activate.mutate(wf.id)}
                              disabled={activate.isLoading}
                            >
                              <Play className="h-4 w-4 mr-1" /> Ativar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() =>
                              execute.mutate({ workflowId: wf.id })
                            }
                            disabled={execute.isLoading}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" /> Executar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Últimas Execuções</CardTitle>
            <CardDescription>
              Status dos workflows e execuções recentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {execLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Iniciado</TableHead>
                      <TableHead>Finalizado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {executions.data?.map((ex: any) => (
                      <TableRow key={ex.id}>
                        <TableCell className="font-mono text-xs">
                          {ex.id}
                        </TableCell>
                        <TableCell>{ex.workflowId}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ex.status === "success"
                                ? "success"
                                : ex.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {ex.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(ex.startedAt)}</TableCell>
                        <TableCell>
                          {ex.stoppedAt ? formatDate(ex.stoppedAt) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
