"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, TrendingUp, MapPin, Clock, Eye, Construction, Users, Shield, Star } from "lucide-react"

interface UserStats {
  totalReports: number
  accuracyRate: number
  helpfulVotes: number
  rank: string
  badgesEarned: string[]
  impactScore: number
}

interface UserReport {
  id: string
  type: string
  location: string
  description: string
  timestamp: Date
  status: "active" | "resolved" | "investigating"
  upvotes: number
  accuracy: number
}

const mockStats: UserStats = {
  totalReports: 23,
  accuracyRate: 94,
  helpfulVotes: 156,
  rank: "Safety Guardian",
  badgesEarned: ["First Report", "Accurate Reporter", "Community Helper", "Safety Advocate"],
  impactScore: 847,
}

const mockUserReports: UserReport[] = [
  {
    id: "1",
    type: "lighting",
    location: "Park Avenue & 3rd Street",
    description: "Street light has been out for 3 days...",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "investigating",
    upvotes: 12,
    accuracy: 95,
  },
  {
    id: "2",
    type: "construction",
    location: "Oak Street Sidewalk",
    description: "Broken sidewalk creating trip hazard...",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "resolved",
    upvotes: 8,
    accuracy: 100,
  },
  {
    id: "3",
    type: "harassment",
    location: "Metro Station Platform",
    description: "Inappropriate behavior reported...",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "resolved",
    upvotes: 24,
    accuracy: 92,
  },
]

const getHazardIcon = (type: string) => {
  switch (type) {
    case "lighting":
      return Eye
    case "construction":
      return Construction
    case "harassment":
      return Users
    default:
      return Shield
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-warning/10 text-warning border-warning/20"
    case "investigating":
      return "bg-caution/10 text-caution border-caution/20"
    case "resolved":
      return "bg-safe/10 text-safe border-safe/20"
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20"
  }
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours === 1) return "1 hour ago"
  if (diffInHours < 24) return `${diffInHours} hours ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return "1 day ago"
  return `${diffInDays} days ago`
}

export function UserContributions() {
  const [activeTab, setActiveTab] = useState<"stats" | "reports">("stats")

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
        <Button
          variant={activeTab === "stats" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("stats")}
          className="flex-1"
        >
          My Stats
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("reports")}
          className="flex-1"
        >
          My Reports
        </Button>
      </div>

      {activeTab === "stats" && (
        <div className="space-y-4">
          {/* User Rank */}
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 bg-safe/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-safe" />
              </div>
              <h3 className="font-semibold text-lg">{mockStats.rank}</h3>
              <p className="text-sm text-muted-foreground">Impact Score: {mockStats.impactScore}</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-safe fill-current" : "text-muted-foreground"}`} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-safe">{mockStats.totalReports}</div>
                <div className="text-xs text-muted-foreground">Total Reports</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-safe">{mockStats.accuracyRate}%</div>
                <div className="text-xs text-muted-foreground">Accuracy Rate</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-safe">{mockStats.helpfulVotes}</div>
                <div className="text-xs text-muted-foreground">Helpful Votes</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-safe">{mockStats.badgesEarned.length}</div>
                <div className="text-xs text-muted-foreground">Badges Earned</div>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Achievement Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockStats.badgesEarned.map((badge, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-safe/10 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-safe" />
                  </div>
                  <span className="text-sm font-medium">{badge}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-safe" />
                <h4 className="font-medium">Community Impact</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Your reports have helped improve safety scores for 12 routes</p>
                <p>• 3 hazards you reported have been resolved by authorities</p>
                <p>• Your contributions have been viewed 1,247 times</p>
                <p>• You've helped 89 fellow travelers make safer route choices</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-3">
          {mockUserReports.map((report) => {
            const Icon = getHazardIcon(report.type)

            return (
              <Card key={report.id} className="border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {report.accuracy}% accurate
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{report.location}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{formatTimeAgo(report.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{report.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-muted-foreground">{report.upvotes} helpful votes</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
