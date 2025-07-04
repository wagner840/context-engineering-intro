'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Search, Filter, TrendingUp, Target, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useMainKeywords, useKeywordOpportunities } from '@/hooks/use-keywords'
import { useBlog } from '@/hooks/use-blogs'
import { useModals } from '@/store/ui-store'
import { formatNumber, formatCurrency } from '@/lib/utils'

type CompetitionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'all'
type SearchIntent = 'informational' | 'navigational' | 'commercial' | 'transactional' | 'all'

export default function KeywordsPage() {
  const params = useParams()
  const blogId = params?.blogId as string
  
  const [searchTerm, setSearchTerm] = useState('')
  const [competitionFilter, setCompetitionFilter] = useState<CompetitionLevel>('all')
  const [intentFilter, setIntentFilter] = useState<SearchIntent>('all')
  const [showUsedOnly, setShowUsedOnly] = useState(false)

  const { data: blog } = useBlog(blogId)
  const { data: keywords, isLoading: keywordsLoading, error: keywordsError } = useMainKeywords(blogId)
  const { data: opportunities, isLoading: opportunitiesLoading } = useKeywordOpportunities(blogId)
  const { openModal } = useModals()

  const filteredKeywords = keywords?.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCompetition = competitionFilter === 'all' || keyword.competition === competitionFilter
    const matchesIntent = intentFilter === 'all' || keyword.search_intent === intentFilter
    const matchesUsed = !showUsedOnly || keyword.is_used
    
    return matchesSearch && matchesCompetition && matchesIntent && matchesUsed
  })

  const stats = keywords ? {
    total: keywords.length,
    used: keywords.filter(k => k.is_used).length,
    unused: keywords.filter(k => !k.is_used).length,
    avgMsv: Math.round(keywords.reduce((sum, k) => sum + (k.msv || 0), 0) / keywords.length),
    avgDifficulty: Math.round(keywords.reduce((sum, k) => sum + (k.kw_difficulty || 0), 0) / keywords.length),
    avgCpc: keywords.reduce((sum, k) => sum + (k.cpc || 0), 0) / keywords.length,
  } : null

  const handleCreateKeyword = () => {
    openModal('create-keyword', { blogId })
  }

  const handleEditKeyword = (keyword: any) => {
    openModal('edit-keyword', { keyword })
  }

  const handleImportKeywords = () => {
    openModal('import-keywords', { blogId })
  }

  if (keywordsLoading) {
    return <KeywordsPageSkeleton />
  }

  if (keywordsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Keywords</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading keywords: {keywordsError.message}</p>
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
          <h1 className="text-3xl font-bold">Keywords</h1>
          <p className="text-muted-foreground">
            Keyword research and opportunities for {blog?.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleImportKeywords}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Import Keywords
          </Button>
          <Button onClick={handleCreateKeyword}>
            <Plus className="h-4 w-4 mr-2" />
            Add Keyword
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.total)}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(stats.used)} used, {formatNumber(stats.unused)} unused
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
                Search volume per keyword
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Difficulty</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDifficulty}%</div>
              <p className="text-xs text-muted-foreground">
                Keyword difficulty
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg CPC</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.avgCpc)}</div>
              <p className="text-xs text-muted-foreground">
                Cost per click
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Keyword Opportunities */}
      {!opportunitiesLoading && opportunities && opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Opportunities</CardTitle>
            <CardDescription>
              Keywords ranked by opportunity score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {opportunities.slice(0, 5).map((opportunity, index) => (
                <div key={opportunity.keyword} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{opportunity.keyword}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>MSV: {formatNumber(opportunity.msv || 0)}</span>
                        <span>•</span>
                        <span>Difficulty: {opportunity.kw_difficulty || 0}%</span>
                        <span>•</span>
                        <span>Intent: {opportunity.search_intent}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(opportunity.opportunity_score)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {opportunity.priority_level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
          <CardDescription>
            All keywords for this blog with filtering and search
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
            
            <Select value={competitionFilter} onValueChange={(value: CompetitionLevel) => setCompetitionFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Competition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competition</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={intentFilter} onValueChange={(value: SearchIntent) => setIntentFilter(value)}>
              <SelectTrigger className="w-[150px]">
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

            <Button
              variant={showUsedOnly ? "default" : "outline"}
              onClick={() => setShowUsedOnly(!showUsedOnly)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Used Only
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>MSV</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>CPC</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {searchTerm || competitionFilter !== 'all' || intentFilter !== 'all' || showUsedOnly
                        ? 'No keywords match your filters.'
                        : 'No keywords found.'}
                      <div className="mt-2">
                        <Button variant="outline" onClick={handleCreateKeyword}>
                          Add your first keyword
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKeywords?.map((keyword) => (
                    <TableRow
                      key={keyword.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleEditKeyword(keyword)}
                    >
                      <TableCell>
                        <div className="font-medium">{keyword.keyword}</div>
                      </TableCell>
                      <TableCell>
                        {keyword.msv ? formatNumber(keyword.msv) : '-'}
                      </TableCell>
                      <TableCell>
                        {keyword.kw_difficulty ? (
                          <div className="flex items-center space-x-2">
                            <span>{keyword.kw_difficulty}%</span>
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  keyword.kw_difficulty <= 30
                                    ? 'bg-green-500'
                                    : keyword.kw_difficulty <= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${keyword.kw_difficulty}%` }}
                              />
                            </div>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {keyword.cpc ? formatCurrency(keyword.cpc) : '-'}
                      </TableCell>
                      <TableCell>
                        {keyword.competition && (
                          <Badge
                            variant={
                              keyword.competition === 'LOW'
                                ? 'default'
                                : keyword.competition === 'MEDIUM'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {keyword.competition}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {keyword.search_intent && (
                          <Badge variant="outline">
                            {keyword.search_intent}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={keyword.is_used ? "default" : "secondary"}>
                          {keyword.is_used ? 'Used' : 'Unused'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditKeyword(keyword)
                          }}
                        >
                          Edit
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

function KeywordsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
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
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}