"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";

export interface Blog {
  id: string;
  name: string;
  domain: string;
  niche: string;
  description: string;
  wordpress_url: string;
  wordpress_username: string;
  wordpress_password: string;
  color: string;
  icon: string;
}

export const BLOGS: Blog[] = [
  {
    id: "718d1bf5-ba1a-4c86-8fa4-c13599eb4952",
    name: "Einsof7",
    domain: "einsof7.com",
    niche: "TV e Streaming",
    description:
      "Blog especializado em TV, streaming e tecnologia de entretenimento",
    wordpress_url:
      process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_URL || "https://einsof7.com",
    wordpress_username:
      process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_USERNAME ||
      "contatopawa@gmail.com",
    wordpress_password:
      process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_PASSWORD ||
      "B0lk 6UEQ kNEz aVgP KnFS WXJBd",
    color: "blue",
    icon: "📺",
  },
  {
    id: "25228f83-0b0d-47c7-926f-1ab6d7255f7b",
    name: "Optemil",
    domain: "optemil.com",
    niche: "Saúde e Bem-estar",
    description:
      "Blog focado em saúde, bem-estar e qualidade de vida",
    wordpress_url:
      process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_URL || "https://optemil.com",
    wordpress_username:
      process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_USERNAME ||
      "contatopawa@gmail.com",
    wordpress_password:
      process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_PASSWORD ||
      "7FoB NxNd DNsU 7Mew O9Dr dLiY",
    color: "green",
    icon: "🌿",
  },
];

type BlogSelection = Blog | "all";

interface BlogContextType {
  activeBlog: BlogSelection | null;
  setActiveBlog: (blog: BlogSelection) => void;
  blogs: Blog[];
  isLoading: boolean;
  selectedBlogIds: string[];
  getBlogById: (id: string) => Blog | undefined;
  isAllSelected: boolean;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
  children: ReactNode;
}

export function BlogProvider({ children }: BlogProviderProps) {
  const [activeBlog, setActiveBlogState] = useState<BlogSelection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedBlog = localStorage.getItem("activeBlog");
    if (savedBlog === "all") {
      setActiveBlogState("all");
    } else if (savedBlog) {
      const blog = BLOGS.find((b) => b.id === savedBlog);
      setActiveBlogState(blog || "all");
    } else {
      setActiveBlogState("all");
    }
    setIsLoading(false);
  }, []);

  const setActiveBlog = (blog: BlogSelection) => {
    setActiveBlogState(blog);
    localStorage.setItem("activeBlog", blog === "all" ? "all" : blog.id);
  };

  const contextValue = useMemo(() => {
    const selectedBlogIds = activeBlog === "all" ? BLOGS.map(b => b.id) : activeBlog ? [activeBlog.id] : [];
    const isAllSelected = activeBlog === "all";
    const getBlogById = (id: string) => BLOGS.find(b => b.id === id);

    return {
      activeBlog,
      setActiveBlog,
      blogs: BLOGS,
      isLoading,
      selectedBlogIds,
      getBlogById,
      isAllSelected,
    };
  }, [activeBlog, isLoading]);

  return (
    <BlogContext.Provider value={contextValue}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}
