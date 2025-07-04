'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Search, Brain, Sparkles, Filter, Download, Target, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { useAdvancedVectorSearch, useSemanticClusters } from '@/hooks/use-vector-search'
import { useBlog } from '@/hooks/use-blogs'
import { formatNumber } from '@/lib/utils'

type SimilarityThreshold = 0.7 | 0.8 | 0.9
type SearchType = 'semantic' | 'hybrid' | 'all'

export default function VectorSearchPage() {
  const params = useParams()
  const blogId = params?.blogId as string
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('semantic')
  const [similarityThreshold, setSimilarityThreshold] = useState<SimilarityThreshold>(0.8)
  const [maxResults, setMaxResults] = useState(20)
  const [searchExecuted, setSearchExecuted] = useState(false)

  const { data: blog } = useBlog(blogId)
  const { data: clusters, isLoading: clustersLoading } = useSemanticClusters(blogId)
  const { 
    data: searchResults, 
    isLoading: searchLoading,
    mutate: executeSearch 
  } = useAdvancedVectorSearch()

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    executeSearch({
      query: searchQuery,
      blogId,
      similarityThreshold,
      maxResults,
      searchType
    })
    setSearchExecuted(true)
  }

  const handleExportResults = () => {
    if (!searchResults) return
    
    const csvData = searchResults.map(result => ({
      keyword: result.keyword,
      similarity: result.similarity,
      cluster: result.cluster_name,
      search_volume: result.search_volume,
      intent: result.search_intent,
      usage_status: result.is_used ? 'Used' : 'Available'
    }))
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vector-search-${searchQuery}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return 'text-green-600'
    if (similarity >= 0.8) return 'text-yellow-600'
    if (similarity >= 0.7) return 'text-orange-600'
    return 'text-red-600'
  }

  const getSimilarityBadgeVariant = (similarity: number) => {
    if (similarity >= 0.9) return 'default'
    if (similarity >= 0.8) return 'secondary'
    if (similarity >= 0.7) return 'outline'
    return 'destructive'
  }

  const stats = clusters ? {
    totalClusters: clusters.length,
    totalKeywords: clusters.reduce((sum, c) => sum + c.keyword_count, 0),
    avgClusterSize: Math.round(clusters.reduce((sum, c) => sum + c.keyword_count, 0) / clusters.length),
    topCluster: clusters.sort((a, b) => b.keyword_count - a.keyword_count)[0]
  } : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vector Search</h1>
          <p className="text-muted-foreground">
            Semantic keyword search and clustering for {blog?.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {searchResults && (
            <Button variant="outline" onClick={handleExportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          )}
        </div>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Semantic Search</span>
          </CardTitle>
          <CardDescription>
            Search for keywords using natural language and semantic similarity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your search query (e.g., 'sustainable energy solutions')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={!searchQuery.trim() || searchLoading}>
                {searchLoading ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {searchLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Search Options */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Type</label>
                <Select value={searchType} onValueChange={(value: SearchType) => setSearchType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semantic">Semantic</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="all">All Results</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Similarity Threshold</label>
                <Select 
                  value={similarityThreshold.toString()} 
                  onValueChange={(value) => setSimilarityThreshold(Number(value) as SimilarityThreshold)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.7">70% (Loose)</SelectItem>
                    <SelectItem value="0.8">80% (Balanced)</SelectItem>
                    <SelectItem value="0.9">90% (Strict)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Results: {maxResults}</label>
                <Slider
                  value={[maxResults]}
                  onValueChange={([value]) => setMaxResults(value)}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cluster Statistics */}
      {clustersLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : stats ? (
        <Card>
          <CardHeader>
            <CardTitle>Semantic Clusters</CardTitle>
            <CardDescription>
              AI-powered keyword clustering and semantic relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Total Clusters</h4>
                <p className="text-2xl font-bold">{formatNumber(stats.totalClusters)}</p>
                <p className="text-xs text-muted-foreground">
                  Semantic groups
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Total Keywords</h4>
                <p className="text-2xl font-bold">{formatNumber(stats.totalKeywords)}</p>
                <p className="text-xs text-muted-foreground">
                  Clustered keywords
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Avg Cluster Size</h4>
                <p className="text-2xl font-bold">{stats.avgClusterSize}</p>
                <p className="text-xs text-muted-foreground">
                  Keywords per cluster
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Largest Cluster</h4>
                <p className="text-2xl font-bold">{stats.topCluster?.keyword_count || 0}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {stats.topCluster?.cluster_name || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Search Results */}
      {searchExecuted && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Keywords ranked by semantic similarity to your query
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Similarity</TableHead>
                      <TableHead>Cluster</TableHead>
                      <TableHead>Search Volume</TableHead>
                      <TableHead>Intent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((result, index) => (
                      <TableRow key={result.keyword} className="hover:bg-muted/50">
                        <TableCell>
                          <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{result.keyword}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className={`text-lg font-bold ${getSimilarityColor(result.similarity)}`}>
                              {Math.round(result.similarity * 100)}%
                            </span>
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                style={{ width: `${result.similarity * 100}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {result.cluster_name && (
                            <Badge variant="outline" className="truncate max-w-[150px]">
                              {result.cluster_name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {result.search_volume ? formatNumber(result.search_volume) : '-'}
                        </TableCell>
                        <TableCell>
                          {result.search_intent && (
                            <Badge variant="outline">
                              {result.search_intent}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={result.is_used ? "default" : "secondary"}>
                            {result.is_used ? 'Used' : 'Available'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No results found for your search query.' : 'Enter a search query to get started.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Semantic Clusters */}
      {!clustersLoading && clusters && clusters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Semantic Clusters</CardTitle>
            <CardDescription>
              AI-generated keyword clusters based on semantic similarity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clusters.slice(0, 9).map((cluster) => (
                <Card key={cluster.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">{cluster.cluster_name}</h4>
                      <Badge variant="secondary">
                        {formatNumber(cluster.keyword_count)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {cluster.description || 'No description available'}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      <span>Avg Score: {Math.round(cluster.avg_similarity * 100)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}