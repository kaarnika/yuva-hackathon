"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Camera, MapPin, X, Send, Eye, Car, Users, Construction, Dog } from "lucide-react"

interface HazardReport {
  type: string
  location: string
  description: string
  severity: "low" | "medium" | "high"
  photo?: File
  isAnonymous: boolean
}

const hazardTypes = [
  { id: "lighting", name: "Poor Lighting", icon: Eye, color: "text-caution" },
  { id: "construction", name: "Construction", icon: Construction, color: "text-warning" },
  { id: "traffic", name: "Traffic Hazard", icon: Car, color: "text-warning" },
  { id: "harassment", name: "Harassment", icon: Users, color: "text-destructive" },
  { id: "animals", name: "Stray Animals", icon: Dog, color: "text-caution" },
  { id: "other", name: "Other", icon: AlertTriangle, color: "text-muted-foreground" },
]

interface HazardReportFormProps {
  onClose: () => void
  onSubmit: (report: HazardReport) => void
}

export function HazardReportForm({ onClose, onSubmit }: HazardReportFormProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhoto(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedType || !location || !description) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const report: HazardReport = {
      type: selectedType,
      location,
      description,
      severity,
      photo: photo || undefined,
      isAnonymous,
    }

    onSubmit(report)
    setIsSubmitting(false)
  }

  const getSeverityColor = (sev: string) => {
    switch (sev) {
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Report Safety Hazard</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Hazard Type Selection */}
          <div>
            <Label className="text-sm font-medium">What type of hazard?</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {hazardTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.id)}
                    className="h-auto p-3 flex-col space-y-1 bg-transparent"
                  >
                    <Icon className={`w-4 h-4 ${type.color}`} />
                    <span className="text-xs">{type.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Corner of Main St & Oak Ave"
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the hazard in detail..."
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* Severity */}
          <div>
            <Label className="text-sm font-medium">Severity Level</Label>
            <div className="flex space-x-2 mt-2">
              {(["low", "medium", "high"] as const).map((sev) => (
                <Button
                  key={sev}
                  variant={severity === sev ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSeverity(sev)}
                  className="flex-1 bg-transparent"
                >
                  <Badge className={`${getSeverityColor(sev)} text-xs`}>
                    {sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-sm font-medium">Photo (Optional)</Label>
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
              <Button
                variant="outline"
                onClick={() => document.getElementById("photo-upload")?.click()}
                className="w-full bg-transparent"
              >
                <Camera className="w-4 h-4 mr-2" />
                {photo ? "Photo Selected" : "Add Photo"}
              </Button>
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="anonymous" className="text-sm">
              Submit anonymously
            </Label>
          </div>

          {/* Privacy Notice */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              Your report helps improve safety for everyone. Location data is used to update safety scores and will be
              shared with the community. Personal information is kept private unless you choose to include it.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedType || !location || !description || isSubmitting}
            className="w-full bg-safe hover:bg-safe/90 text-safe-foreground"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-safe-foreground/20 border-t-safe-foreground rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
