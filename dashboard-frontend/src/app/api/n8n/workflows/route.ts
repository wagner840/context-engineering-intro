import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validação com Zod
const executeWorkflowSchema = z.object({
  workflowId: z.string().min(1, "ID do workflow é obrigatório"),
  blogId: z.string().uuid("ID do blog deve ser um UUID válido"),
  inputData: z.record(z.any()).optional(),
  waitForCompletion: z.boolean().default(false),
});

const createWorkflowSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  blogId: z.string().uuid("ID do blog deve ser um UUID válido"),
  template: z.enum(["blog_sync", "content_generation", "seo_analysis"]),
  config: z.record(z.any()).optional(),
});

// Cliente N8N otimizado
class N8nApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_N8N_BASE_URL || "https://n8n.einsof7.com/api/v1";
    this.apiKey = process.env.NEXT_PUBLIC_N8N_API_KEY || "";

    if (!this.apiKey) {
      throw new Error("N8N API key não configurada");
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "X-N8N-API-KEY": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`N8N API Error ${response.status}: ${error}`);
    }

    return response.json();
  }

  async getWorkflows() {
    return this.request("/workflows");
  }

  async getWorkflow(id: string) {
    return this.request(`/workflows/${id}`);
  }

  async createWorkflow(workflowData: any) {
    return this.request("/workflows", {
      method: "POST",
      body: JSON.stringify(workflowData),
    });
  }

  async updateWorkflow(id: string, workflowData: any) {
    return this.request(`/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(workflowData),
    });
  }

  async activateWorkflow(id: string) {
    return this.request(`/workflows/${id}/activate`, {
      method: "POST",
    });
  }

  async deactivateWorkflow(id: string) {
    return this.request(`/workflows/${id}/deactivate`, {
      method: "POST",
    });
  }

  async executeWorkflow(id: string, inputData?: any) {
    return this.request(`/workflows/${id}/execute`, {
      method: "POST",
      body: JSON.stringify({ data: inputData }),
    });
  }

  async getExecutions(workflowId?: string) {
    const endpoint = workflowId
      ? `/executions?workflowId=${workflowId}`
      : "/executions";
    return this.request(endpoint);
  }

  async getExecution(id: string) {
    return this.request(`/executions/${id}`);
  }

  async testConnection() {
    try {
      await this.request("/workflows?limit=1");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }
}

// Templates de workflows
const getWorkflowTemplate = (template: string, config: any = {}) => {
  const templates = {
    blog_sync: {
      name: config.name || "Blog Sync Workflow",
      nodes: [
        {
          id: "1",
          name: "Webhook",
          type: "n8n-nodes-base.webhook",
          position: [250, 300],
          parameters: {
            path: `blog-sync-${config.blogId}`,
            responseMode: "onReceived",
          },
        },
        {
          id: "2",
          name: "Supabase Query",
          type: "n8n-nodes-base.supabase",
          position: [450, 300],
          parameters: {
            operation: "getAll",
            table: "content_posts",
            filters: {
              blog_id: config.blogId,
              status: "publish",
            },
          },
        },
        {
          id: "3",
          name: "WordPress Sync",
          type: "n8n-nodes-base.wordpress",
          position: [650, 300],
          parameters: {
            operation: "create",
            resource: "post",
            title: "={{ $json.title }}",
            content: "={{ $json.content }}",
          },
        },
      ],
      connections: {
        Webhook: {
          main: [["Supabase Query"]],
        },
        "Supabase Query": {
          main: [["WordPress Sync"]],
        },
      },
    },
    content_generation: {
      name: config.name || "Content Generation Workflow",
      nodes: [
        {
          id: "1",
          name: "Schedule Trigger",
          type: "n8n-nodes-base.scheduleTrigger",
          position: [250, 300],
          parameters: {
            rule: {
              interval: [
                {
                  field: "hours",
                  hoursInterval: 6,
                },
              ],
            },
          },
        },
        {
          id: "2",
          name: "Get Keywords",
          type: "n8n-nodes-base.supabase",
          position: [450, 300],
          parameters: {
            operation: "getAll",
            table: "main_keywords",
            filters: {
              blog_id: config.blogId,
              is_used: false,
            },
            limit: 5,
          },
        },
        {
          id: "3",
          name: "OpenAI Content",
          type: "@n8n/n8n-nodes-langchain.openAi",
          position: [650, 300],
          parameters: {
            model: "gpt-4",
            prompt: "Crie um artigo sobre: {{ $json.keyword }}",
          },
        },
        {
          id: "4",
          name: "Save to Supabase",
          type: "n8n-nodes-base.supabase",
          position: [850, 300],
          parameters: {
            operation: "create",
            table: "content_posts",
            fields: {
              blog_id: config.blogId,
              title: "={{ $json.title }}",
              content: "={{ $json.content }}",
              status: "draft",
            },
          },
        },
      ],
      connections: {
        "Schedule Trigger": {
          main: [["Get Keywords"]],
        },
        "Get Keywords": {
          main: [["OpenAI Content"]],
        },
        "OpenAI Content": {
          main: [["Save to Supabase"]],
        },
      },
    },
    seo_analysis: {
      name: config.name || "SEO Analysis Workflow",
      nodes: [
        {
          id: "1",
          name: "Webhook",
          type: "n8n-nodes-base.webhook",
          position: [250, 300],
          parameters: {
            path: `seo-analysis-${config.blogId}`,
          },
        },
        {
          id: "2",
          name: "Get Post",
          type: "n8n-nodes-base.supabase",
          position: [450, 300],
          parameters: {
            operation: "get",
            table: "content_posts",
            id: "={{ $json.postId }}",
          },
        },
        {
          id: "3",
          name: "SEO Analysis",
          type: "@n8n/n8n-nodes-langchain.openAi",
          position: [650, 300],
          parameters: {
            model: "gpt-4",
            prompt: "Analise o SEO deste conteúdo: {{ $json.content }}",
          },
        },
        {
          id: "4",
          name: "Update SEO Score",
          type: "n8n-nodes-base.supabase",
          position: [850, 300],
          parameters: {
            operation: "update",
            table: "content_posts",
            id: "={{ $json.id }}",
            fields: {
              seo_score: "={{ $json.score }}",
              meta_description: "={{ $json.meta_description }}",
            },
          },
        },
      ],
      connections: {
        Webhook: {
          main: [["Get Post"]],
        },
        "Get Post": {
          main: [["SEO Analysis"]],
        },
        "SEO Analysis": {
          main: [["Update SEO Score"]],
        },
      },
    },
  };

  return templates[template as keyof typeof templates] || null;
};

// GET - Listar workflows
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");

    const n8nClient = new N8nApiClient();
    const workflows = await n8nClient.getWorkflows();

    // Filtrar por blogId se fornecido
    let filteredWorkflows = workflows.data || [];
    if (blogId) {
      filteredWorkflows = filteredWorkflows.filter(
        (workflow: any) =>
          workflow.name.includes(blogId) || workflow.tags?.includes(blogId)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredWorkflows,
      total: filteredWorkflows.length,
    });
  } catch (error) {
    console.error("Erro ao listar workflows:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// POST - Criar workflow ou executar workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    const n8nClient = new N8nApiClient();

    if (action === "execute") {
      // Executar workflow
      const { workflowId, blogId, inputData } =
        executeWorkflowSchema.parse(body);

      const execution = await n8nClient.executeWorkflow(workflowId, {
        blogId,
        ...inputData,
      });

      // Log da execução no Supabase
      // await supabase.from('workflow_executions').insert({
      //   workflow_id: workflowId,
      //   n8n_execution_id: execution.data.id,
      //   status: 'running',
      //   input_data: { blogId, ...inputData },
      // })

      return NextResponse.json({
        success: true,
        data: execution,
        message: "Workflow executado com sucesso",
      });
    } else {
      // Criar workflow
      const { name, blogId, template, config } =
        createWorkflowSchema.parse(body);

      const workflowTemplate = getWorkflowTemplate(template, {
        ...config,
        blogId,
        name,
      });

      if (!workflowTemplate) {
        return NextResponse.json(
          {
            success: false,
            error: "Template de workflow não encontrado",
          },
          { status: 400 }
        );
      }

      const newWorkflow = await n8nClient.createWorkflow({
        ...workflowTemplate,
        tags: [blogId, template],
      });

      return NextResponse.json({
        success: true,
        data: newWorkflow,
        message: "Workflow criado com sucesso",
      });
    }
  } catch (error) {
    console.error("Erro na operação com workflow:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar workflow
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("id");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID do workflow é obrigatório",
        },
        { status: 400 }
      );
    }

    const n8nClient = new N8nApiClient();
    const updatedWorkflow = await n8nClient.updateWorkflow(workflowId, body);

    return NextResponse.json({
      success: true,
      data: updatedWorkflow,
      message: "Workflow atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar workflow:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
