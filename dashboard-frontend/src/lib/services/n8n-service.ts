interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  settings?: any;
  staticData?: any;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface N8nExecution {
  id: string;
  finished: boolean;
  mode: string;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  workflowData?: N8nWorkflow;
  status?: "success" | "error" | "running" | "waiting";
  data?: any;
}

interface N8nWebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class N8nService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.N8N_API_URL || "https://n8n.einsof7.com/api/v1";
    this.apiKey = process.env.N8N_API_KEY || "";
  }

  private async fetchN8n(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiUrl}${endpoint}`;

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
      throw new Error(`N8N API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Workflows
  async getWorkflows(options?: {
    active?: boolean;
    tags?: string[];
    limit?: number;
    cursor?: string;
  }): Promise<{ data: N8nWorkflow[]; nextCursor?: string }> {
    const params = new URLSearchParams();

    if (options) {
      if (options.active !== undefined)
        params.append("active", String(options.active));
      if (options.tags) params.append("tags", options.tags.join(","));
      if (options.limit) params.append("limit", String(options.limit));
      if (options.cursor) params.append("cursor", options.cursor);
    }

    const endpoint = `/workflows${params.toString() ? `?${params.toString()}` : ""}`;
    return this.fetchN8n(endpoint);
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.fetchN8n(`/workflows/${id}`);
  }

  async createWorkflow(workflow: {
    name: string;
    nodes: any[];
    connections: any;
    settings?: any;
    staticData?: any;
    active?: boolean;
  }): Promise<N8nWorkflow> {
    return this.fetchN8n("/workflows", {
      method: "POST",
      body: JSON.stringify(workflow),
    });
  }

  async updateWorkflow(
    id: string,
    updates: Partial<N8nWorkflow>
  ): Promise<N8nWorkflow> {
    return this.fetchN8n(`/workflows/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.fetchN8n(`/workflows/${id}`, {
      method: "DELETE",
    });
  }

  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.updateWorkflow(id, { active: true });
  }

  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.updateWorkflow(id, { active: false });
  }

  // Executions
  async getExecutions(options?: {
    workflowId?: string;
    status?: "success" | "error" | "waiting";
    limit?: number;
    cursor?: string;
  }): Promise<{ data: N8nExecution[]; nextCursor?: string }> {
    const params = new URLSearchParams();

    if (options) {
      if (options.workflowId) params.append("workflowId", options.workflowId);
      if (options.status) params.append("status", options.status);
      if (options.limit) params.append("limit", String(options.limit));
      if (options.cursor) params.append("cursor", options.cursor);
    }

    const endpoint = `/executions${params.toString() ? `?${params.toString()}` : ""}`;
    return this.fetchN8n(endpoint);
  }

  async getExecution(id: string): Promise<N8nExecution> {
    return this.fetchN8n(`/executions/${id}`);
  }

  async deleteExecution(id: string): Promise<void> {
    await this.fetchN8n(`/executions/${id}`, {
      method: "DELETE",
    });
  }

  // Webhook trigger
  async triggerWebhook(
    webhookPath: string,
    data: any
  ): Promise<N8nWebhookResponse> {
    try {
      const webhookUrl = `https://n8n.einsof7.com/webhook/${webhookPath}`;

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Webhook error: ${response.status} - ${error}`,
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Blog-specific workflows
  async triggerBlogSync(
    blogId: string,
    blogDomain: string
  ): Promise<N8nWebhookResponse> {
    return this.triggerWebhook("blog-sync", {
      blogId,
      blogDomain,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerContentGeneration(data: {
    blogId: string;
    keyword: string;
    title: string;
    outline?: string;
  }): Promise<N8nWebhookResponse> {
    return this.triggerWebhook("content-generation", data);
  }

  async triggerKeywordResearch(data: {
    blogId: string;
    mainKeyword: string;
    location?: string;
    language?: string;
  }): Promise<N8nWebhookResponse> {
    return this.triggerWebhook("keyword-research", data);
  }

  async triggerSerpAnalysis(data: {
    blogId: string;
    keyword: string;
    location?: string;
  }): Promise<N8nWebhookResponse> {
    return this.triggerWebhook("serp-analysis", data);
  }

  // Get workflow templates for blogs
  getWorkflowTemplates() {
    return {
      blogSync: {
        name: "Blog Sync Workflow",
        description: "Sincroniza posts entre Supabase e WordPress",
        nodes: [
          {
            id: "1",
            name: "Webhook",
            type: "n8n-nodes-base.webhook",
            position: [250, 300],
            parameters: {
              path: "blog-sync",
              responseMode: "onReceived",
              responseData: "allEntries",
            },
          },
          {
            id: "2",
            name: "Supabase",
            type: "n8n-nodes-base.supabase",
            position: [450, 300],
            parameters: {
              operation: "getAll",
              tableId: "content_posts",
              filters: {
                blog_id: '={{ $json["blogId"] }}',
              },
            },
          },
          {
            id: "3",
            name: "WordPress",
            type: "n8n-nodes-base.wordpress",
            position: [650, 300],
            parameters: {
              operation: "create",
              resource: "post",
              title: '={{ $json["title"] }}',
              content: '={{ $json["content"] }}',
            },
          },
        ],
        connections: {
          Webhook: {
            main: [[{ node: "Supabase", type: "main", index: 0 }]],
          },
          Supabase: {
            main: [[{ node: "WordPress", type: "main", index: 0 }]],
          },
        },
      },
      contentGeneration: {
        name: "Content Generation Workflow",
        description: "Gera conteúdo usando IA baseado em keywords",
        nodes: [
          {
            id: "1",
            name: "Webhook",
            type: "n8n-nodes-base.webhook",
            position: [250, 300],
            parameters: {
              path: "content-generation",
              responseMode: "onReceived",
            },
          },
          {
            id: "2",
            name: "OpenAI",
            type: "@n8n/n8n-nodes-langchain.openAi",
            position: [450, 300],
            parameters: {
              model: "gpt-4",
              prompt:
                'Gere um artigo sobre {{ $json["keyword"] }} com o título {{ $json["title"] }}',
            },
          },
          {
            id: "3",
            name: "Supabase",
            type: "n8n-nodes-base.supabase",
            position: [650, 300],
            parameters: {
              operation: "create",
              tableId: "content_posts",
              fields: {
                blog_id: '={{ $json["blogId"] }}',
                title: '={{ $json["title"] }}',
                content: '={{ $json["content"] }}',
                status: "draft",
              },
            },
          },
        ],
        connections: {
          Webhook: {
            main: [[{ node: "OpenAI", type: "main", index: 0 }]],
          },
          OpenAI: {
            main: [[{ node: "Supabase", type: "main", index: 0 }]],
          },
        },
      },
    };
  }

  // Health check
  async healthCheck(): Promise<{ status: "ok" | "error"; message?: string }> {
    try {
      await this.getWorkflows({ limit: 1 });
      return { status: "ok" };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
