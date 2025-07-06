export interface SimilarKeyword {
  id: string;
  keyword: string;
  similarity: number;
}

export interface SimilarPost {
  id: string;
  title: string;
  similarity: number;
}

export interface VectorSearchParams {
  query: string;
  blogId: string;
  similarityThreshold: number;
  maxResults: number;
  searchType: "semantic" | "hybrid" | "all";
}

export interface VectorSearchResult {
  keyword: string;
  similarity: number;
  cluster_name?: string;
  search_volume?: number;
  search_intent?: string;
  is_used: boolean;
  embedding?: number[];
}
