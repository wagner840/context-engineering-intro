"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  Globe,
  Target,
  FileText,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Eye,
  Database,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardCounts } from "@/hooks/use-dashboard-counts";
import Link from "next/link";

// Valores padrão caso dados ainda não tenham sido carregados
const defaultStats = {
  totalBlogs: 0,
  totalKeywords: 0,
  totalPosts: 0,
  publishedPosts: 0,
  totalOpportunities: 0,
  avgMsv: 0,
  avgDifficulty: 0,
  avgCpc: 0,
  conversionRate: 0,
};

// Dados para gráficos
const trafficData = [
  { name: "Jan", value: 12000 },
  { name: "Fev", value: 19000 },
  { name: "Mar", value: 23000 },
  { name: "Abr", value: 28000 },
  { name: "Mai", value: 36000 },
  { name: "Jun", value: 45780 },
];

const keywordDistribution = [
  { name: "Alta Competição", value: 300, color: "#8b5cf6" },
  { name: "Média Competição", value: 600, color: "#06b6d4" },
  { name: "Baixa Competição", value: 350, color: "#10b981" },
];


export function ExecutiveDashboard() {
  const { data: counts, isLoading: countsLoading } = useDashboardCounts();
  const isLoading = countsLoading;
  const stats = counts
    ? {
        totalBlogs: counts?.total_blogs || 0,
        totalKeywords: counts?.total_keywords || 0,
        totalPosts: counts?.total_posts || 0,
        publishedPosts: 0, // TODO: adicionar view com posts publicados
        totalOpportunities: counts?.total_opportunities || 0,
        avgMsv: counts?.avg_msv || 0,
        avgDifficulty: counts?.avg_difficulty || 0,
        avgCpc: counts?.avg_cpc || 0,
        conversionRate: counts?.conversion_rate || 0,
      }
    : defaultStats;
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Action Bar */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">Visão Geral</h2>
          <p className="text-muted-foreground">
            Última atualização há 5 minutos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="7d">7 dias</TabsTrigger>
              <TabsTrigger value="30d">30 dias</TabsTrigger>
              <TabsTrigger value="90d">90 dias</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Métricas Principais */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <MetricCard
          title="Total de Blogs"
          value={formatNumber(stats.totalBlogs)}
          subtitle="Sites WordPress ativos"
          icon={Globe}
          trend={{ value: 0, direction: "neutral" }}
          color="primary"
          className="glass-card gradient-border card-hover shine"
        />

        <MetricCard
          title="Palavras-chave"
          value={formatNumber(stats.totalKeywords)}
          subtitle="Base de pesquisa"
          icon={Target}
          trend={{ value: 18.2, direction: "up" }}
          color="success"
          className="glass-card gradient-border card-hover shine"
        />

        <MetricCard
          title="Posts de Conteúdo"
          value={formatNumber(stats.totalPosts)}
          subtitle={`${formatNumber(stats.publishedPosts)} publicados`}
          icon={FileText}
          trend={{ value: 12.5, direction: "up" }}
          color="info"
          className="glass-card gradient-border card-hover shine"
        />

        <MetricCard
          title="Oportunidades"
          value={formatNumber(stats.totalOpportunities)}
          subtitle="Conteúdo potencial"
          icon={TrendingUp}
          trend={{ value: -5.4, direction: "down" }}
          color="warning"
          className="glass-card gradient-border card-hover shine"
        />
      </motion.div>

      {/* Gráficos Principais */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de Tráfego */}
        <Card className="glass-card gradient-border card-hover shine">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Tráfego Mensal
            </CardTitle>
            <CardDescription>
              Evolução das visualizações nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Keywords */}
        <Card className="glass-card gradient-border card-hover shine">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Distribuição de Keywords
            </CardTitle>
            <CardDescription>
              Classificação por nível de competição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={keywordDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {keywordDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card gradient-border card-hover shine">
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
            <CardDescription>
              Indicadores chave de desempenho do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PerformanceMetric
                label="Volume de Busca Médio"
                value={formatNumber(stats.avgMsv || 0)}
                icon={Eye}
                color="primary"
              />
              <PerformanceMetric
                label="Dificuldade Média"
                value={`${stats.avgDifficulty || 0}%`}
                icon={Activity}
                color="warning"
              />
              <PerformanceMetric
                label="CPC Médio"
                value={formatCurrency(stats.avgCpc || 0)}
                icon={DollarSign}
                color="success"
              />
              <PerformanceMetric
                label="Taxa de Conversão"
                value={`${stats.conversionRate || 0}%`}
                icon={TrendingUp}
                color="info"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card gradient-border card-hover shine">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/blogs" className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-2 btn-glow shine gradient-border hover-scale"
                >
                  <Globe className="h-6 w-6" />
                  <span>Gerenciar Blogs</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 btn-glow shine gradient-border hover-scale"
              >
                <Target className="h-6 w-6" />
                <span>Pesquisa de Keywords</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 btn-glow shine gradient-border hover-scale"
              >
                <FileText className="h-6 w-6" />
                <span>Pipeline de Conteúdo</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 btn-glow shine gradient-border hover-scale"
              >
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Componente de Métrica
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
  className = "",
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend: { value: number; direction: "up" | "down" | "neutral" };
  color?: "primary" | "success" | "warning" | "info";
  className?: string;
}) {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    info: "text-info bg-info/10",
  };

  return (
    <Card className={`card-hover glass relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          {trend.direction !== "neutral" && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend.direction === "up" ? "text-success" : "text-destructive"
              }`}
            >
              {trend.direction === "up" ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de Métrica de Performance
function PerformanceMetric({
  label,
  value,
  icon: Icon,
  color = "primary",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: "primary" | "success" | "warning" | "info";
}) {
  const colorClasses = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

// Skeleton Loading
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 skeleton-shimmer" />
          <Skeleton className="h-4 w-32 mt-2 skeleton-shimmer" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64 skeleton-shimmer" />
          <Skeleton className="h-10 w-10 skeleton-shimmer" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass skeleton-shimmer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24 skeleton-shimmer" />
              <Skeleton className="h-8 w-8 rounded-lg skeleton-shimmer" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2 skeleton-shimmer" />
              <Skeleton className="h-3 w-32 skeleton-shimmer" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="glass skeleton-shimmer">
            <CardHeader>
              <Skeleton className="h-5 w-32 skeleton-shimmer" />
              <Skeleton className="h-4 w-48 skeleton-shimmer" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full skeleton-shimmer" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
