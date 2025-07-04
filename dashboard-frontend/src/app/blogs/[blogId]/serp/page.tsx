'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Search, TrendingUp, Crown, Eye, BarChart3, Filter, Download, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useSerpResults, useSerpAnalysis } from '@/hooks/use-serp'
import { useBlog } from '@/hooks/use-blogs'
import { useModals } from '@/store/ui-store'
import { formatDate, formatNumber } from '@/lib/utils'

type PositionFilter = 'top3' | 'top10' | 'top20' | 'all'
type SearchIntent = 'informational' | 'navigational' | 'commercial' | 'transactional' | 'all'

export default function SerpAnalysisPage() {
  const params = useParams()
  const blogId = params?.blogId as string
  
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('all')
  const [intentFilter, setIntentFilter] = useState<SearchIntent>('all')
  const [minRankingScore, setMinRankingScore] = useState<number>(0)

  const { data: blog } = useBlog(blogId)
  const { data: serpResults, isLoading, error } = useSerpResults(blogId)
  const analysis = useSerpAnalysis(blogId)
  const { openModal } = useModals()

  const filteredResults = serpResults?.filter(result => {
    const matchesSearch = result.keyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.url?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPosition = positionFilter === 'all' || 
                           (positionFilter === 'top3' && result.position <= 3) ||
                           (positionFilter === 'top10' && result.position <= 10) ||
                           (positionFilter === 'top20' && result.position <= 20)
    const matchesIntent = intentFilter === 'all' || result.search_intent === intentFilter
    const matchesScore = (result.ranking_score || 0) >= minRankingScore
    
    return matchesSearch && matchesPosition && matchesIntent && matchesScore
  })

  const handleExportResults = () => {
    // TODO: Implement CSV export
    console.log('Exporting SERP results...')
  }

  const handleTrackKeyword = () => {
    openModal('track-keyword', { blogId })
  }

  const handleViewDetails = (result: any) => {
    openModal('serp-details', { result })
  }

  const getRankingColor = (position: number) => {
    if (position <= 3) return 'text-green-600'
    if (position <= 10) return 'text-yellow-600'
    if (position <= 20) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRankingBadgeVariant = (position: number) => {
    if (position <= 3) return 'default'
    if (position <= 10) return 'secondary'
    if (position <= 20) return 'outline'
    return 'destructive'
  }

  if (isLoading) {
    return <SerpAnalysisPageSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">SERP Analysis</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading SERP data: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SERP Analysis</h1>
          <p className="text-muted-foreground">
            Search engine results analysis and competitive insights for {blog?.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleTrackKeyword}>
            <Search className="h-4 w-4 mr-2" />
            Track Keyword
          </Button>
          <Button variant="outline" onClick={handleExportResults}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {analysis && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tracked Keywords</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analysis.totalKeywords)}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(analysis.topThreePositions)} in top 3
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Position</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.avgPosition.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Average ranking position
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top 10 Rankings</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatNumber(analysis.topTenPositions)}</div>
              <p className="text-xs text-muted-foreground">
                {((analysis.topTenPositions / analysis.totalKeywords) * 100).toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visibility Score</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.overallVisibilityScore}</div>
              <p className="text-xs text-muted-foreground">
                Search visibility index
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Position Distribution */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Position Distribution</CardTitle>
            <CardDescription>
              Breakdown of keyword positions across different SERP ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Top 3</div>
                  <div className="text-2xl font-bold text-green-600">{formatNumber(analysis.topThreePositions)}</div>
                </div>
                <Badge variant="default">1-3</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Top 10</div>
                  <div className="text-2xl font-bold text-yellow-600">{formatNumber(analysis.topTenPositions - analysis.topThreePositions)}</div>
                </div>
                <Badge variant="secondary">4-10</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Top 20</div>
                  <div className="text-2xl font-bold text-orange-600">{formatNumber(analysis.topTwentyPositions - analysis.topTenPositions)}</div>
                </div>
                <Badge variant="outline">11-20</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Below 20</div>
                  <div className="text-2xl font-bold text-red-600">{formatNumber(analysis.totalKeywords - analysis.topTwentyPositions)}</div>
                </div>
                <Badge variant="destructive">20+</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SERP Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>SERP Results</CardTitle>
          <CardDescription>
            Search engine results for tracked keywords with competitive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keywords or URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={positionFilter} onValueChange={(value: PositionFilter) => setPositionFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="top3">Top 3</SelectItem>
                <SelectItem value="top10">Top 10</SelectItem>
                <SelectItem value="top20">Top 20</SelectItem>
              </SelectContent>
            </Select>

            <Select value={intentFilter} onValueChange={(value: SearchIntent) => setIntentFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Intent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intents</SelectItem>
                <SelectItem value="informational">Informational</SelectItem>
                <SelectItem value="navigational">Navigational</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="transactional">Transactional</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <span className="text-sm">Min Score:</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={minRankingScore}
                onChange={(e) => setMinRankingScore(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {searchTerm || positionFilter !== 'all' || intentFilter !== 'all' || minRankingScore > 0
                        ? 'No results match your filters.'
                        : 'No SERP results found.'}
                      <div className="mt-2">
                        <Button variant="outline" onClick={handleTrackKeyword}>
                          Start tracking keywords
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResults?.map((result) => (
                    <TableRow
                      key={`${result.keyword}-${result.position}`}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(result)}
                    >
                      <TableCell>
                        <Badge variant={getRankingBadgeVariant(result.position)}>
                          #{result.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{result.keyword}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-xs truncate max-w-xs">
                            {result.url}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-xs" title={result.title}>
                          {result.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {result.result_type && (
                          <Badge variant="outline">
                            {result.result_type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.search_intent && (
                          <Badge variant="outline">
                            {result.search_intent}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.ranking_score ? (
                          <div className="flex items-center space-x-2">
                            <span className={getRankingColor(result.position)}>
                              {Math.round(result.ranking_score)}
                            </span>
                            <div className="w-8 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                style={{ width: `${result.ranking_score}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(result.updated_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetails(result)
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SerpAnalysisPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}