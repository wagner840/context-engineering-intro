import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Database } from '@/types/database'
import { supabase, calculateKeywordOpportunityScore } from '@/lib/supabase'

type MainKeyword = Database['public']['Tables']['main_keywords']['Row']
type KeywordVariation = Database['public']['Tables']['keyword_variations']['Row']
type KeywordOpportunity = Database['public']['Views']['keyword_opportunities']['Row']
type MainKeywordInsert = Database['public']['Tables']['main_keywords']['Insert']
type KeywordVariationInsert = Database['public']['Tables']['keyword_variations']['Insert']

interface KeywordState {
  mainKeywords: MainKeyword[]
  keywordVariations: KeywordVariation[]
  keywordOpportunities: KeywordOpportunity[]
  selectedKeyword: MainKeyword | null
  loading: boolean
  error: string | null
  filters: {
    searchTerm: string
    competition: string | null
    searchIntent: string | null
    isUsed: boolean | null
    minMsv: number | null
    maxDifficulty: number | null
  }

  // Actions
  fetchMainKeywords: (blogId: string) => Promise<void>
  fetchKeywordVariations: (mainKeywordId: string) => Promise<void>
  fetchKeywordOpportunities: (blogId: string) => Promise<void>
  createMainKeyword: (keyword: MainKeywordInsert) => Promise<MainKeyword>
  createKeywordVariation: (variation: KeywordVariationInsert) => Promise<KeywordVariation>
  updateMainKeyword: (id: string, updates: Partial<MainKeyword>) => Promise<MainKeyword>
  deleteMainKeyword: (id: string) => Promise<void>
  markKeywordAsUsed: (id: string, isUsed: boolean) => Promise<void>
  selectKeyword: (keyword: MainKeyword) => void
  setFilters: (filters: Partial<KeywordState['filters']>) => void
  clearFilters: () => void
  clearError: () => void
  
  // Computed
  getFilteredKeywords: () => MainKeyword[]
  getKeywordVariationsByMainId: (mainKeywordId: string) => KeywordVariation[]
  getOpportunityScoreForKeyword: (keyword: MainKeyword) => Promise<number>
}

const initialFilters = {
  searchTerm: '',
  competition: null,
  searchIntent: null,
  isUsed: null,
  minMsv: null,
  maxDifficulty: null,
}

export const useKeywordStore = create<KeywordState>()(
  devtools(
    (set, get) => ({
      mainKeywords: [],
      keywordVariations: [],
      keywordOpportunities: [],
      selectedKeyword: null,
      loading: false,
      error: null,
      filters: initialFilters,

      fetchMainKeywords: async (blogId: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase
            .from('main_keywords')
            .select('*')
            .eq('blog_id', blogId)
            .order('created_at', { ascending: false })

          if (error) throw error
          set({ mainKeywords: data, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch keywords',
            loading: false 
          })
        }
      },

      fetchKeywordVariations: async (mainKeywordId: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase
            .from('keyword_variations')
            .select('*')
            .eq('main_keyword_id', mainKeywordId)
            .order('created_at', { ascending: false })

          if (error) throw error
          set({ keywordVariations: data, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch keyword variations',
            loading: false 
          })
        }
      },

      fetchKeywordOpportunities: async (blogId: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase
            .from('keyword_opportunities')
            .select('*')
            .eq('blog_name', blogId) // Assuming blog_name maps to blog_id in view
            .order('opportunity_score', { ascending: false })
            .limit(50)

          if (error) throw error
          set({ keywordOpportunities: data, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch keyword opportunities',
            loading: false 
          })
        }
      },

      createMainKeyword: async (keyword: MainKeywordInsert) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase
            .from('main_keywords')
            .insert(keyword)
            .select()
            .single()

          if (error) throw error

          const currentKeywords = get().mainKeywords
          set({ 
            mainKeywords: [data, ...currentKeywords],
            loading: false 
          })

          return data
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create keyword',
            loading: false 
          })
          throw error
        }
      },

      createKeywordVariation: async (variation: KeywordVariationInsert) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase
            .from('keyword_variations')
            .insert(variation)
            .select()
            .single()

          if (error) throw error

          const currentVariations = get().keywordVariations
          set({ 
            keywordVariations: [data, ...currentVariations],
            loading: false 
          })

          return data
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create keyword variation',
            loading: false 
          })
          throw error
        }
      },

      updateMainKeyword: async (id: string, updates: Partial<MainKeyword>) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase
            .from('main_keywords')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

          if (error) throw error

          const currentKeywords = get().mainKeywords
          const updatedKeywords = currentKeywords.map(keyword => 
            keyword.id === id ? data : keyword
          )

          const currentSelected = get().selectedKeyword
          const updatedSelected = currentSelected?.id === id ? data : currentSelected

          set({ 
            mainKeywords: updatedKeywords,
            selectedKeyword: updatedSelected,
            loading: false 
          })

          return data
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update keyword',
            loading: false 
          })
          throw error
        }
      },

      deleteMainKeyword: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const { error } = await supabase
            .from('main_keywords')
            .delete()
            .eq('id', id)

          if (error) throw error

          const currentKeywords = get().mainKeywords
          const filteredKeywords = currentKeywords.filter(keyword => keyword.id !== id)

          const currentSelected = get().selectedKeyword
          const updatedSelected = currentSelected?.id === id ? null : currentSelected

          set({ 
            mainKeywords: filteredKeywords,
            selectedKeyword: updatedSelected,
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete keyword',
            loading: false 
          })
          throw error
        }
      },

      markKeywordAsUsed: async (id: string, isUsed: boolean) => {
        try {
          await get().updateMainKeyword(id, { is_used: isUsed })
        } catch (error) {
          throw error
        }
      },

      selectKeyword: (keyword: MainKeyword) => {
        set({ selectedKeyword: keyword })
      },

      setFilters: (newFilters: Partial<KeywordState['filters']>) => {
        set({ 
          filters: { 
            ...get().filters, 
            ...newFilters 
          } 
        })
      },

      clearFilters: () => {
        set({ filters: initialFilters })
      },

      clearError: () => {
        set({ error: null })
      },

      // Computed getters
      getFilteredKeywords: () => {
        const { mainKeywords, filters } = get()
        
        return mainKeywords.filter(keyword => {
          if (filters.searchTerm && !keyword.keyword.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false
          }
          if (filters.competition && keyword.competition !== filters.competition) {
            return false
          }
          if (filters.searchIntent && keyword.search_intent !== filters.searchIntent) {
            return false
          }
          if (filters.isUsed !== null && keyword.is_used !== filters.isUsed) {
            return false
          }
          if (filters.minMsv !== null && (keyword.msv || 0) < filters.minMsv) {
            return false
          }
          if (filters.maxDifficulty !== null && (keyword.kw_difficulty || 100) > filters.maxDifficulty) {
            return false
          }
          
          return true
        })
      },

      getKeywordVariationsByMainId: (mainKeywordId: string) => {
        return get().keywordVariations.filter(
          variation => variation.main_keyword_id === mainKeywordId
        )
      },

      getOpportunityScoreForKeyword: async (keyword: MainKeyword) => {
        try {
          return await calculateKeywordOpportunityScore(
            keyword.msv,
            keyword.kw_difficulty,
            keyword.cpc
          )
        } catch (error) {
          console.error('Failed to calculate opportunity score:', error)
          return 0
        }
      }
    }),
    {
      name: 'keyword-store',
    }
  )
)