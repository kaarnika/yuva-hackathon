"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HazardReportForm } from "@/components/hazard-report-form"
import { CommunityFeed } from "@/components/community-feed"
import { UserContributions } from "@/components/user-contributions"
import { Shield, Users, Plus, TrendingUp } from "lucide-react"

export function CommunityReporting() {
  const [activeTab, setActiveTab] = useState<"feed" | "report" | "contributions">("feed")
  const [showReportForm, setShowReportForm] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-safe/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-safe" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Community Safety</h1>
                <p className="text-sm text-muted-foreground">Help keep everyone safe</p>
              </div>
            </div>
            <Button
              onClick={() => setShowReportForm(true)}
              className="bg-safe hover:bg-safe/90 text-safe-foreground"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-safe/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-4 h-4 text-safe" />
              </div>
              <div className="text-lg font-bold">1,247</div>
              <div className="text-xs text-muted-foreground">Reports This Week</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-safe/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-safe" />
              </div>
              <div className="text-lg font-bold">94%</div>
              <div className="text-xs text-muted-foreground">Accuracy Rate</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-safe/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-safe" />
              </div>
              <div className="text-lg font-bold">8.2k</div>
              <div className="text-xs text-muted-foreground">Active Contributors</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted/50 rounded-lg p-1">
          <Button
            variant={activeTab === "feed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("feed")}
            className="flex-1"
          >
            Community Feed
          </Button>
          <Button
            variant={activeTab === "contributions" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("contributions")}
            className="flex-1"
          >
            My Reports
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "feed" && <CommunityFeed />}
        {activeTab === "contributions" && <UserContributions />}
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <HazardReportForm
          onClose={() => setShowReportForm(false)}
          onSubmit={(report) => {
            console.log("New report submitted:", report)
            setShowReportForm(false)
          }}
        />
      )}
    </div>
  )
}
