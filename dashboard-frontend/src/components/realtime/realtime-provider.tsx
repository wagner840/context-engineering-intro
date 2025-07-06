"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { useNotifications } from "@/store/ui-store";
import { useBlogStore } from "@/store/blog-store";

interface RealtimeEvent {
  table: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  old: Record<string, unknown> | null;
  new: Record<string, unknown> | null;
  timestamp: string;
}

interface RealtimeContextType {
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  subscribe: (
    table: string,
    callback: (event: RealtimeEvent) => void
  ) => () => void;
  unsubscribe: (table: string) => void;
  events: RealtimeEvent[];
  clearEvents: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined
);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [events, setEvents] = useState<RealtimeEvent[]>([]);

  // Use refs to avoid re-creating functions and causing infinite loops
  const subscriptionsRef = useRef<
    Map<string, ReturnType<typeof supabaseRef.current.channel>>
  >(new Map());
  const callbacksRef = useRef<Map<string, Set<(event: RealtimeEvent) => void>>>(
    new Map()
  );
  const supabaseRef = useRef(createSupabaseClient());
  const notificationsRef = useRef(useNotifications());
  const blogStoreRef = useRef(useBlogStore());

  const addEvent = useCallback((event: RealtimeEvent) => {
    setEvents((prev) => [event, ...prev.slice(0, 99)]); // Keep last 100 events
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const subscribe = useCallback(
    (table: string, callback: (event: RealtimeEvent) => void) => {
      // Add callback to the set for this table
      if (!callbacksRef.current.has(table)) {
        callbacksRef.current.set(table, new Set());
      }
      callbacksRef.current.get(table)!.add(callback);

      // If this is the first subscription for this table, create the channel
      if (!subscriptionsRef.current.has(table)) {
        const channel = supabaseRef.current
          .channel(`realtime-${table}-${Date.now()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: table,
              filter: blogStoreRef.current.selectedBlog?.id
                ? `blog_id=eq.${blogStoreRef.current.selectedBlog.id}`
                : undefined,
            },
            (payload) => {
              const event: RealtimeEvent = {
                table,
                eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
                old: payload.old || null,
                new: payload.new || null,
                timestamp: new Date().toISOString(),
              };

              // Add to events list
              addEvent(event);

              // Call all callbacks for this table
              const tableCallbacks = callbacksRef.current.get(table);
              if (tableCallbacks) {
                tableCallbacks.forEach((cb) => {
                  try {
                    cb(event);
                  } catch (error) {
                    console.error("Error in realtime callback:", error);
                  }
                });
              }

              // Show notification for important events (throttled)
              if (
                (table === "content_posts" ||
                  table === "workflow_executions") &&
                payload.eventType === "INSERT"
              ) {
                const action = payload.eventType.toLowerCase();
                const entityName =
                  payload.new?.title || payload.new?.name || `${table} item`;

                try {
                  notificationsRef.current.addNotification({
                    type: "info",
                    title: `${table} ${action}d`,
                    message: `${entityName} was ${action}d`,
                  });
                } catch (error) {
                  console.error("Error showing notification:", error);
                }
              }
            }
          )
          .subscribe((status) => {
            console.log(`Subscription status for ${table}:`, status);

            if (status === "SUBSCRIBED") {
              setIsConnected(true);
              setConnectionStatus("connected");
            } else if (status === "CHANNEL_ERROR") {
              setConnectionStatus("error");
              try {
                notificationsRef.current.addNotification({
                  type: "error",
                  title: "Realtime connection error",
                  message: `Failed to subscribe to ${table} changes`,
                });
              } catch (error) {
                console.error("Error showing error notification:", error);
              }
            } else if (status === "CLOSED") {
              setConnectionStatus("disconnected");
            }
          });

        subscriptionsRef.current.set(table, channel);
      }

      // Return unsubscribe function
      return () => {
        const tableCallbacks = callbacksRef.current.get(table);
        if (tableCallbacks) {
          tableCallbacks.delete(callback);
          if (tableCallbacks.size === 0) {
            callbacksRef.current.delete(table);
            // Remove channel subscription if no more callbacks
            const channel = subscriptionsRef.current.get(table);
            if (channel) {
              supabaseRef.current.removeChannel(channel);
              subscriptionsRef.current.delete(table);
            }
          }
        }
      };
    },
    [addEvent]
  );

  const unsubscribe = useCallback((table: string) => {
    const channel = subscriptionsRef.current.get(table);
    if (channel) {
      supabaseRef.current.removeChannel(channel);
      subscriptionsRef.current.delete(table);
    }
    callbacksRef.current.delete(table);
  }, []);

  // Initialize core subscriptions only once
  useEffect(() => {
    if (subscriptionsRef.current.size === 0) {
      setConnectionStatus("connecting");

      // Subscribe to important tables with minimal callbacks
      const coreSubscriptions = ["content_posts", "workflow_executions"];

      const unsubscribeFunctions: (() => void)[] = [];

      coreSubscriptions.forEach((table) => {
        const unsub = subscribe(table, () => {
          // Empty callback for core subscriptions - just track events
        });
        unsubscribeFunctions.push(unsub);
      });

      return () => {
        unsubscribeFunctions.forEach((unsub) => unsub());
      };
    }
  }, [subscribe]);

  // Cleanup on unmount
  useEffect(() => {
    const currentCallbacks = callbacksRef.current;
    return () => {
      currentCallbacks.clear();
    };
  }, []);

  // Monitor connection status - simplified
  useEffect(() => {
    const interval = setInterval(() => {
      const hasActiveSubscriptions = subscriptionsRef.current.size > 0;
      setIsConnected(hasActiveSubscriptions);
    }, 10000); // Check every 10 seconds instead of 5

    return () => clearInterval(interval);
  }, []);

  const value: RealtimeContextType = {
    isConnected,
    connectionStatus,
    subscribe,
    unsubscribe,
    events,
    clearEvents,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
}

// Specific hooks for common use cases
export function useRealtimeTable(
  table: string,
  callback?: (event: RealtimeEvent) => void,
  enabled: boolean = true
) {
  const { subscribe } = useRealtime();

  useEffect(() => {
    if (!enabled || !callback) return;

    const unsubscribe = subscribe(table, callback);
    return unsubscribe;
  }, [table, callback, enabled, subscribe]);
}

export function useRealtimeContentPosts(
  blogId: string,
  onUpdate?: (event: RealtimeEvent) => void
) {
  const { subscribe } = useRealtime();

  useEffect(() => {
    if (!blogId) return;

    const unsubscribe = subscribe("content_posts", (event) => {
      // Only handle events for the current blog
      if (event.new?.blog_id === blogId || event.old?.blog_id === blogId) {
        onUpdate?.(event);
      }
    });

    return unsubscribe;
  }, [blogId, onUpdate, subscribe]);
}

export function useRealtimeWorkflowExecutions(
  onUpdate?: (event: RealtimeEvent) => void
) {
  const { subscribe } = useRealtime();

  useEffect(() => {
    const unsubscribe = subscribe("workflow_executions", (event) => {
      onUpdate?.(event);
    });

    return unsubscribe;
  }, [onUpdate, subscribe]);
}

export function useRealtimeKeywords(
  blogId: string,
  onUpdate?: (event: RealtimeEvent) => void
) {
  const { subscribe } = useRealtime();

  useEffect(() => {
    if (!blogId) return;

    const unsubscribe = subscribe("main_keywords", (event) => {
      // Only handle events for the current blog
      if (event.new?.blog_id === blogId || event.old?.blog_id === blogId) {
        onUpdate?.(event);
      }
    });

    return unsubscribe;
  }, [blogId, onUpdate, subscribe]);
}
