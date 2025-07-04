'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Clock, 
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { useRealtime } from './realtime-provider'
import { formatDistanceToNow } from 'date-fns'

export function RealtimeStatus() {
  const { isConnected, connectionStatus, events, clearEvents } = useRealtime()
  const [lastEventTime, setLastEventTime] = useState<Date | null>(null)

  useEffect(() => {
    if (events.length > 0) {
      setLastEventTime(new Date(events[0].timestamp))
    }
  }, [events])

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Wifi className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case 'connecting':
        return (
          <Badge variant="secondary">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Connecting
          </Badge>
        )
      case 'disconnected':
        return (
          <Badge variant="outline">
            <WifiOff className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            Unknown
          </Badge>
        )
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'INSERT':
        return '+'
      case 'UPDATE':
        return '~'
      case 'DELETE':
        return '-'
      default:
        return '?'
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'INSERT':
        return 'text-green-600'
      case 'UPDATE':
        return 'text-blue-600'
      case 'DELETE':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Realtime Status</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Live updates from database changes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Status</span>
          </div>
          <span className="font-medium capitalize">{connectionStatus}</span>
        </div>

        {/* Last Event */}
        {lastEventTime && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Last Event</span>
            </div>
            <span className="font-medium">
              {formatDistanceToNow(lastEventTime, { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Event Count */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Events</span>
          </div>
          <span className="font-medium">{events.length}</span>
        </div>

        {/* Recent Events */}
        {events.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Recent Events</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearEvents}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
            
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {events.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    <span className={`font-mono font-bold ${getEventColor(event.eventType)}`}>
                      {getEventIcon(event.eventType)}
                    </span>
                    <span className="font-medium">{event.table}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
            
            {events.length > 5 && (
              <div className="text-xs text-muted-foreground text-center">
                +{events.length - 5} more events
              </div>
            )}
          </div>
        )}

        {/* Connection Status Indicator */}
        <div className="flex items-center space-x-2 pt-2 border-t">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`} />
          <span className="text-xs text-muted-foreground">
            {isConnected ? 'Receiving live updates' : 'No live connection'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}