"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBlog } from "@/contexts/blog-context";

export function BlogSelectorDropdown() {
  const { activeBlog, setActiveBlog, blogs, isLoading } = useBlog();

  if (isLoading) {
    return (
      <div className="w-48 h-10 bg-muted rounded-md animate-pulse" />
    );
  }

  const getCurrentSelection = () => {
    if (activeBlog === "all") {
      return {
        name: "Todos os Blogs",
        icon: <Globe className="h-4 w-4" />,
        color: "text-foreground"
      };
    }
    
    if (activeBlog) {
      return {
        name: activeBlog.name,
        icon: <span className="text-sm">{activeBlog.icon}</span>,
        color: activeBlog.color === "blue" ? "text-blue-600" : "text-green-600"
      };
    }
    
    return {
      name: "Selecione um Blog",
      icon: <Globe className="h-4 w-4" />,
      color: "text-muted-foreground"
    };
  };

  const current = getCurrentSelection();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-48 justify-between bg-background"
        >
          <div className="flex items-center gap-2">
            <span className={current.color}>
              {current.icon}
            </span>
            <span className="truncate">{current.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <DropdownMenuItem
          onClick={() => setActiveBlog("all")}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-foreground" />
              <span>Todos os Blogs</span>
            </div>
            {activeBlog === "all" && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </div>
        </DropdownMenuItem>
        
        {blogs.map((blog) => (
          <DropdownMenuItem
            key={blog.id}
            onClick={() => setActiveBlog(blog)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-sm">{blog.icon}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{blog.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {blog.domain}
                  </span>
                </div>
              </div>
              {activeBlog !== "all" && activeBlog?.id === blog.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}