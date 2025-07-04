// Main store exports
export { useBlogStore } from './blog-store'
export { useKeywordStore } from './keyword-store'
export { useContentStore } from './content-store'
export { 
  useUIStore,
  useNotifications,
  useModals,
  useLoading,
  useTheme,
  useGlobalSearch
} from './ui-store'

// Type exports
export type { Database } from '@/types/database'

// Utility for resetting all stores (useful for testing or logout)
export const resetAllStores = () => {
  // Note: This would need to be implemented if stores had reset methods
  // For now, individual stores handle their own state reset
  console.log('Store reset functionality would be implemented here')
}

// Global store initialization
export const initializeStores = async () => {
  // This can be called on app startup to initialize all stores
  // with necessary data or subscriptions
  console.log('Store initialization would be implemented here')
}