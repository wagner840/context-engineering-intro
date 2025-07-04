import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface Modal {
  id: string
  type: string
  isOpen: boolean
  props?: Record<string, any>
}

interface UIState {
  // Navigation
  sidebarCollapsed: boolean
  activeSection: string
  breadcrumbs: Array<{ label: string; href?: string }>

  // Notifications
  notifications: Notification[]

  // Modals
  modals: Modal[]

  // Loading states
  globalLoading: boolean
  pageLoading: boolean

  // Theme
  theme: 'light' | 'dark' | 'system'

  // Search
  globalSearchOpen: boolean
  globalSearchTerm: string

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void
  setActiveSection: (section: string) => void
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // Modal actions
  openModal: (type: string, props?: Record<string, any>) => void
  closeModal: (id?: string) => void
  closeAllModals: () => void

  // Loading actions
  setGlobalLoading: (loading: boolean) => void
  setPageLoading: (loading: boolean) => void

  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Search actions
  setGlobalSearchOpen: (open: boolean) => void
  setGlobalSearchTerm: (term: string) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sidebarCollapsed: false,
        activeSection: 'dashboard',
        breadcrumbs: [],
        notifications: [],
        modals: [],
        globalLoading: false,
        pageLoading: false,
        theme: 'system',
        globalSearchOpen: false,
        globalSearchTerm: '',

        // Navigation actions
        setSidebarCollapsed: (collapsed: boolean) => {
          set({ sidebarCollapsed: collapsed })
        },

        setActiveSection: (section: string) => {
          set({ activeSection: section })
        },

        setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => {
          set({ breadcrumbs })
        },

        // Notification actions
        addNotification: (notification: Omit<Notification, 'id'>) => {
          const id = Math.random().toString(36).substring(7)
          const newNotification: Notification = {
            id,
            duration: 5000, // Default 5 seconds
            ...notification,
          }

          set({ 
            notifications: [...get().notifications, newNotification] 
          })

          // Auto-remove notification after duration
          if (newNotification.duration) {
            setTimeout(() => {
              get().removeNotification(id)
            }, newNotification.duration)
          }
        },

        removeNotification: (id: string) => {
          set({ 
            notifications: get().notifications.filter(n => n.id !== id) 
          })
        },

        clearNotifications: () => {
          set({ notifications: [] })
        },

        // Modal actions
        openModal: (type: string, props?: Record<string, any>) => {
          const id = Math.random().toString(36).substring(7)
          const newModal: Modal = {
            id,
            type,
            isOpen: true,
            props,
          }

          set({ 
            modals: [...get().modals, newModal] 
          })
        },

        closeModal: (id?: string) => {
          if (id) {
            set({ 
              modals: get().modals.filter(m => m.id !== id) 
            })
          } else {
            // Close the last opened modal
            const modals = get().modals
            if (modals.length > 0) {
              set({ 
                modals: modals.slice(0, -1) 
              })
            }
          }
        },

        closeAllModals: () => {
          set({ modals: [] })
        },

        // Loading actions
        setGlobalLoading: (loading: boolean) => {
          set({ globalLoading: loading })
        },

        setPageLoading: (loading: boolean) => {
          set({ pageLoading: loading })
        },

        // Theme actions
        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme })
        },

        // Search actions
        setGlobalSearchOpen: (open: boolean) => {
          set({ globalSearchOpen: open })
          if (!open) {
            set({ globalSearchTerm: '' })
          }
        },

        setGlobalSearchTerm: (term: string) => {
          set({ globalSearchTerm: term })
        },
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
)

// Convenience hooks for common patterns
export const useNotifications = () => {
  const { notifications, addNotification, removeNotification, clearNotifications } = useUIStore()
  return { notifications, addNotification, removeNotification, clearNotifications }
}

export const useModals = () => {
  const { modals, openModal, closeModal, closeAllModals } = useUIStore()
  return { modals, openModal, closeModal, closeAllModals }
}

export const useLoading = () => {
  const { globalLoading, pageLoading, setGlobalLoading, setPageLoading } = useUIStore()
  return { globalLoading, pageLoading, setGlobalLoading, setPageLoading }
}

export const useTheme = () => {
  const { theme, setTheme } = useUIStore()
  return { theme, setTheme }
}

export const useGlobalSearch = () => {
  const { globalSearchOpen, globalSearchTerm, setGlobalSearchOpen, setGlobalSearchTerm } = useUIStore()
  return { globalSearchOpen, globalSearchTerm, setGlobalSearchOpen, setGlobalSearchTerm }
}