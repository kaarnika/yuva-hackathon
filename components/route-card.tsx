"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface Route {
  id: string
  name: string
  duration: string
  distance: string
  safetyScore: number
  factors: {
    crime: number
    lighting: number
    traffic: number
    timeOfDay: number
  }
  warnings: string[]
  improvements: string[]
}

interface RouteCardProps {
  route: Route
  isSelected: boolean
  onSelect: () => void
}

export function RouteCard({ route, isSelected, onSelect }: RouteCardProps) {
  const getSafetyColor = (score: number) => {
    if (score >= 70) return "text-safe"
    if (score >= 50) return "text-caution"
    return "text-warning"
  }

  const getSafetyBg = (score: number) => {
    if (score >= 70) return "bg-safe/10 border-safe/20"
    if (score >= 50) return "bg-caution/10 border-caution/20"
    return "bg-warning/10 border-warning/20"
  }

  const getSafetyLabel = (score: number) => {
    if (score >= 70) return "Safe"
    if (score >= 50) return "Moderate"
    return "Caution"
  }

  return (
    <Card
      className={`border cursor-pointer transition-all ${
        isSelected ? "border-safe bg-safe/5" : "border-border hover:border-safe/50"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4 space-y-3">
        {/* Route Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-sm">{route.name}</h3>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{route.distance}</span>
              </div>
            </div>
          </div>
          <Badge className={`${getSafetyBg(route.safetyScore)} ${getSafetyColor(route.safetyScore)}`}>
            {route.safetyScore} {getSafetyLabel(route.safetyScore)}
          </Badge>
        </div>

        {/* Safety Factors */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Crime</div>
            <div className={`text-sm font-medium ${getSafetyColor(route.factors.crime)}`}>{route.factors.crime}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Light</div>
            <div className={`text-sm font-medium ${getSafetyColor(route.factors.lighting)}`}>
              {route.factors.lighting}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Traffic</div>
            <div className={`text-sm font-medium ${getSafetyColor(route.factors.traffic)}`}>
              {route.factors.traffic}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Time</div>
            <div className={`text-sm font-medium ${getSafetyColor(route.factors.timeOfDay)}`}>
              {route.factors.timeOfDay}
            </div>
          </div>
        </div>

        {/* Warnings */}
        {route.warnings.length > 0 && (
          <div className="space-y-1">
            {route.warnings.map((warning, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0" />
                <span className="text-muted-foreground">{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Improvements */}
        {route.improvements.length > 0 && (
          <div className="space-y-1">
            {route.improvements.slice(0, 2).map((improvement, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <CheckCircle className="w-3 h-3 text-safe flex-shrink-0" />
                <span className="text-muted-foreground">{improvement}</span>
              </div>
            ))}
          </div>
        )}

        {/* Route Comparison */}
        {isSelected && (
          <div className="pt-2 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
              <Info className="w-3 h-3 mr-2" />
              Why safer? Tap to see detailed analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
