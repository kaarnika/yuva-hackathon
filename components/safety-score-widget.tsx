"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Car, Clock, Users, AlertCircle } from "lucide-react"

const safetyFactors = [
  {
    name: "Crime Data",
    description: "Recent incident reports and crime statistics",
    icon: Shield,
    weight: "High",
  },
  {
    name: "Lighting",
    description: "Street lighting coverage and visibility",
    icon: Eye,
    weight: "High",
  },
  {
    name: "Traffic Density",
    description: "Pedestrian and vehicle activity levels",
    icon: Car,
    weight: "Medium",
  },
  {
    name: "Time of Day",
    description: "Current time safety context",
    icon: Clock,
    weight: "Medium",
  },
  {
    name: "Community Reports",
    description: "Real-time user-submitted safety observations",
    icon: Users,
    weight: "Low",
  },
]

export function SafetyScoreWidget() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-safe" />
          <CardTitle className="text-base">How Safety Scores Work</CardTitle>
        </div>
        <CardDescription className="text-sm">
          Our AI analyzes multiple factors to compute real-time safety scores from 0-100
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {safetyFactors.map((factor, index) => {
          const Icon = factor.icon
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{factor.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      factor.weight === "High"
                        ? "border-safe/20 text-safe"
                        : factor.weight === "Medium"
                          ? "border-caution/20 text-caution"
                          : "border-muted-foreground/20 text-muted-foreground"
                    }`}
                  >
                    {factor.weight}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
              </div>
            </div>
          )
        })}

        <div className="pt-3 border-t border-border">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Scores update every 10-30 seconds during navigation. Conservative defaults are used when data is limited.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
