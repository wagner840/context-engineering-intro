'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { TrendingUp, Target, BarChart3, Filter, Search, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useKeywordOpportunities } from '@/hooks/use-keywords'
import { useBlog } from '@/hooks/use-blogs'
import { formatNumber, formatCurrency } from '@/lib/utils'

type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'all'
type SearchIntent = 'informational' | 'navigational' | 'commercial' | 'transactional' | 'all'

export default function KeywordOpportunitiesPage() {
  const params = useParams()
  const blogId = params?.blogId as string
  
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel>('all')
  const [intentFilter, setIntentFilter] = useState<SearchIntent>('all')
  const [minOpportunityScore, setMinOpportunityScore] = useState<number>(0)

  const { data: blog } = useBlog(blogId)
  const { data: opportunities, isLoading, error } = useKeywordOpportunities(blogId)

  const filteredOpportunities = opportunities?.filter(opportunity => {
    const matchesSearch = opportunity.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || opportunity.priority_level === priorityFilter
    const matchesIntent = intentFilter === 'all' || opportunity.search_intent === intentFilter
    const matchesScore = opportunity.opportunity_score >= minOpportunityScore
    
    return matchesSearch && matchesPriority && matchesIntent && matchesScore
  })

  const stats = opportunities ? {
    total: opportunities.length,
    high: opportunities.filter(o => o.priority_level === 'HIGH').length,
    medium: opportunities.filter(o => o.priority_level === 'MEDIUM').length,
    low: opportunities.filter(o => o.priority_level === 'LOW').length,
    avgScore: Math.round(opportunities.reduce((sum, o) => sum + o.opportunity_score, 0) / opportunities.length),
    avgMsv: Math.round(opportunities.reduce((sum, o) => sum + (o.msv || 0), 0) / opportunities.length),
    totalVariations: opportunities.reduce((sum, o) => sum + o.variations_count, 0),
  } : null

  const handleExportOpportunities = () => {
    // TODO: Implement CSV export
    console.log('Exporting opportunities...')
  }

  if (isLoading) {
    return <OpportunitiesPageSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Keyword Opportunities</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading opportunities: {error.message}</p>
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
          <h1 className="text-3xl font-bold">Keyword Opportunities</h1>
          <p className="text-muted-foreground">
            High-potential keywords ranked by opportunity score for {blog?.name}
          </p>
        </div>
        <Button variant="outline" onClick={handleExportOpportunities}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.total)}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(stats.high)} high priority
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Opportunity Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}</div>
              <p className="text-xs text-muted-foreground">
                Out of 100 points
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Monthly Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.avgMsv)}</div>
              <p className="text-xs text-muted-foreground">
                Search volume
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Variations</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalVariations)}</div>
              <p className="text-xs text-muted-foreground">
                Keyword variations
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Priority Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>
              Opportunities broken down by priority level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">High Priority</div>
                  <div className="text-2xl font-bold text-red-600">{formatNumber(stats.high)}</div>
                </div>
                <Badge variant="destructive">HIGH</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Medium Priority</div>
                  <div className="text-2xl font-bold text-yellow-600">{formatNumber(stats.medium)}</div>
                </div>
                <Badge variant="secondary">MEDIUM</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Low Priority</div>
                  <div className="text-2xl font-bold text-green-600">{formatNumber(stats.low)}</div>
                </div>
                <Badge variant="outline">LOW</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Opportunities</CardTitle>
          <CardDescription>
            Keywords ranked by opportunity score with filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={priorityFilter} onValueChange={(value: PriorityLevel) => setPriorityFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
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
                value={minOpportunityScore}
                onChange={(e) => setMinOpportunityScore(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Opportunity Score</TableHead>
                  <TableHead>MSV</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>CPC</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Variations</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      {searchTerm || priorityFilter !== 'all' || intentFilter !== 'all' || minOpportunityScore > 0
                        ? 'No opportunities match your filters.'
                        : 'No opportunities found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOpportunities?.map((opportunity, index) => (
                    <TableRow key={opportunity.keyword} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{opportunity.keyword}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            {Math.round(opportunity.opportunity_score)}
                          </span>
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                              style={{ width: `${opportunity.opportunity_score}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {opportunity.msv ? formatNumber(opportunity.msv) : '-'}
                      </TableCell>
                      <TableCell>
                        {opportunity.kw_difficulty ? (
                          <div className="flex items-center space-x-2">
                            <span>{opportunity.kw_difficulty}%</span>
                            <div className="w-8 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  opportunity.kw_difficulty <= 30
                                    ? 'bg-green-500'
                                    : opportunity.kw_difficulty <= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${opportunity.kw_difficulty}%` }}
                              />
                            </div>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {opportunity.cpc ? formatCurrency(opportunity.cpc) : '-'}
                      </TableCell>
                      <TableCell>
                        {opportunity.search_intent && (
                          <Badge variant="outline">
                            {opportunity.search_intent}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            opportunity.priority_level === 'HIGH'
                              ? 'destructive'
                              : opportunity.priority_level === 'MEDIUM'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {opportunity.priority_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{opportunity.variations_count}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={opportunity.is_used ? "default" : "secondary"}>
                          {opportunity.is_used ? 'Used' : 'Available'}
                        </Badge>
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

function OpportunitiesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-24" />
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
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
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