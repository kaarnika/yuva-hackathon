"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Navigation, X, Clock } from "lucide-react"

interface SafetyAlertProps {
  score: number
  warnings: string[]
  onDismiss: () => void
  onReroute: () => void
}

export function SafetyAlert({ score, warnings, onDismiss, onReroute }: SafetyAlertProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-warning/20 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div>
                <CardTitle className="text-base">Safety Alert</CardTitle>
                <Badge variant="outline" className="mt-1 border-warning/20 text-warning">
                  Score: {score}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your current route has a lower safety score. Consider these factors:
            </p>
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <span className="text-sm">{warning}</span>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              SafeWalk can find a safer alternative route that adds approximately 2-3 minutes to your journey but
              improves your safety score to 78+.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onDismiss} className="haptic-pulse bg-transparent">
              Continue Current
            </Button>
            <Button onClick={onReroute} className="bg-safe hover:bg-safe/90 text-safe-foreground haptic-pulse">
              <Navigation className="w-4 h-4 mr-2" />
              Find Safer Route
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Auto-dismiss in 10 seconds</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
