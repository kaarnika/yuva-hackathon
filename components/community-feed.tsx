"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  MapPin,
  Clock,
  ThumbsUp,
  MessageCircle,
  Eye,
  Construction,
  Car,
  Users,
  Dog,
  Shield,
} from "lucide-react"

interface CommunityReport {
  id: string
  type: string
  location: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: Date
  author: string
  isAnonymous: boolean
  upvotes: number
  comments: number
  status: "active" | "resolved" | "investigating"
  hasPhoto: boolean
}

const mockReports: CommunityReport[] = [
  {
    id: "1",
    type: "lighting",
    location: "Park Avenue & 3rd Street",
    description:
      "Street light has been out for 3 days. Very dark corner at night, hard to see approaching pedestrians.",
    severity: "medium",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    author: "Sarah M.",
    isAnonymous: false,
    upvotes: 12,
    comments: 3,
    status: "investigating",
    hasPhoto: true,
  },
  {
    id: "2",
    type: "construction",
    location: "Main Street Bridge",
    description: "Construction barriers blocking sidewalk, forcing pedestrians into traffic lane.",
    severity: "high",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    author: "Anonymous",
    isAnonymous: true,
    upvotes: 28,
    comments: 7,
    status: "active",
    hasPhoto: false,
  },
  {
    id: "3",
    type: "harassment",
    location: "Downtown Transit Station",
    description: "Group of individuals making inappropriate comments to solo travelers, especially women.",
    severity: "high",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    author: "Anonymous",
    isAnonymous: true,
    upvotes: 45,
    comments: 12,
    status: "investigating",
    hasPhoto: false,
  },
  {
    id: "4",
    type: "animals",
    location: "Riverside Park Trail",
    description: "Pack of stray dogs near the north entrance. They seem aggressive and are blocking the path.",
    severity: "medium",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    author: "Mike C.",
    isAnonymous: false,
    upvotes: 8,
    comments: 2,
    status: "resolved",
    hasPhoto: true,
  },
]

const getHazardIcon = (type: string) => {
  switch (type) {
    case "lighting":
      return Eye
    case "construction":
      return Construction
    case "traffic":
      return Car
    case "harassment":
      return Users
    case "animals":
      return Dog
    default:
      return AlertTriangle
  }
}

const getHazardName = (type: string) => {
  switch (type) {
    case "lighting":
      return "Poor Lighting"
    case "construction":
      return "Construction"
    case "traffic":
      return "Traffic Hazard"
    case "harassment":
      return "Harassment"
    case "animals":
      return "Stray Animals"
    default:
      return "Other"
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-safe/10 text-safe border-safe/20"
    case "medium":
      return "bg-caution/10 text-caution border-caution/20"
    case "high":
      return "bg-warning/10 text-warning border-warning/20"
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20"
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

export function CommunityFeed() {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all")
  const [upvotedReports, setUpvotedReports] = useState<Set<string>>(new Set())

  const filteredReports = mockReports.filter((report) => {
    if (filter === "all") return true
    return report.status === filter
  })

  const handleUpvote = (reportId: string) => {
    setUpvotedReports((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(reportId)) {
        newSet.delete(reportId)
      } else {
        newSet.add(reportId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex-1"
        >
          All Reports
        </Button>
        <Button
          variant={filter === "active" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("active")}
          className="flex-1"
        >
          Active
        </Button>
        <Button
          variant={filter === "resolved" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("resolved")}
          className="flex-1"
        >
          Resolved
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => {
          const Icon = getHazardIcon(report.type)
          const isUpvoted = upvotedReports.has(report.id)

          return (
            <Card key={report.id} className="border-border">
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{getHazardName(report.type)}</h4>
                        <Badge className={getSeverityColor(report.severity)}>{report.severity}</Badge>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
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

                {/* Description */}
                <p className="text-sm text-muted-foreground">{report.description}</p>

                {/* Author & Photo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      by {report.isAnonymous ? "Anonymous" : report.author}
                    </span>
                    {report.hasPhoto && (
                      <Badge variant="outline" className="text-xs">
                        📷 Photo
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpvote(report.id)}
                    className={`flex items-center space-x-1 ${isUpvoted ? "text-safe" : "text-muted-foreground"}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isUpvoted ? "fill-current" : ""}`} />
                    <span>{report.upvotes + (isUpvoted ? 1 : 0)}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>{report.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No reports found</h3>
          <p className="text-sm text-muted-foreground">
            {filter === "all" ? "No community reports available yet." : `No ${filter} reports at this time.`}
          </p>
        </div>
      )}
    </div>
  )
}
