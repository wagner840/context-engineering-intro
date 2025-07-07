"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  FileText,
  Target,
  TrendingUp,
  BarChart3,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useBlog } from "@/contexts/blog-context";
import { usePostStats } from "@/hooks/use-posts-dynamic";
import { useKeywordStats } from "@/hooks/use-keywords-dynamic";

function BlogCard({ blog }: { blog: any }) {
  const { data: postStats, isLoading: postsLoading } = usePostStats();
  const { data: keywordStats, isLoading: keywordsLoading } = useKeywordStats();

  const blogPostStats = postStats?.byBlog[blog.id] || { total: 0, published: 0, draft: 0 };
  const blogKeywordStats = keywordStats?.byBlog[blog.id] || { total: 0, active: 0, inactive: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <span className="text-2xl">{blog.icon}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{blog.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {blog.domain}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${
              blog.color === "blue" ? "border-blue-200 text-blue-700" : "border-green-200 text-green-700"
            }`}
          >
            {blog.niche}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{blog.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Posts Stats */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Posts</span>
              </div>
              {postsLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{blogPostStats.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {blogPostStats.published} publicados, {blogPostStats.draft} rascunhos
                  </div>
                </div>
              )}
            </div>
            
            {/* Keywords Stats */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Keywords</span>
              </div>
              {keywordsLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{blogKeywordStats.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {blogKeywordStats.active} ativas, {blogKeywordStats.inactive} inativas
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
            <a
              href={blog.wordpress_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
            >
              Visitar site
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OverallStats() {
  const { data: postStats, isLoading: postsLoading } = usePostStats();
  const { data: keywordStats, isLoading: keywordsLoading } = useKeywordStats();

  if (postsLoading || keywordsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Posts",
      value: postStats?.total || 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Posts Publicados",
      value: postStats?.published || 0,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Total Keywords",
      value: keywordStats?.total || 0,
      icon: Target,
      color: "text-purple-500",
    },
    {
      title: "Keywords Ativas",
      value: keywordStats?.active || 0,
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export function BlogsOverviewDynamic() {
  const { blogs, activeBlog, isAllSelected, isLoading } = useBlog();

  const displayBlogs = useMemo(() => {
    if (isAllSelected) {
      return blogs;
    }
    return activeBlog !== "all" && activeBlog ? [activeBlog] : [];
  }, [blogs, activeBlog, isAllSelected]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAllSelected ? "Todos os Blogs" : (activeBlog !== "all" && activeBlog?.name) || "Blogs"}
          </h1>
          <p className="text-muted-foreground">
            {isAllSelected 
              ? "Visão geral de todos os seus blogs" 
              : `Gerenciamento do blog ${(activeBlog !== "all" && activeBlog?.name) || "selecionado"}`
            }
          </p>
        </div>
        {isAllSelected && (
          <Badge variant="outline" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            {blogs.length} blogs ativos
          </Badge>
        )}
      </div>

      <OverallStats />

      {displayBlogs.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhum blog selecionado. Use o seletor de blogs na barra lateral.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}