"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Phone, Shield, Clock, CheckCircle, X, Pause } from "lucide-react"

interface EscalationLevel {
  level: number
  name: string
  description: string
  actions: string[]
  timeoutSeconds: number
}

const escalationLevels: EscalationLevel[] = [
  {
    level: 1,
    name: "Safety Alert",
    description: "Low safety score detected",
    actions: ["Voice alert", "Haptic feedback", "Route suggestion"],
    timeoutSeconds: 15,
  },
  {
    level: 2,
    name: "Enhanced Monitoring",
    description: "No response to safety alert",
    actions: ["Increased GPS tracking", "Pre-arm emergency contacts", "Voice check-in"],
    timeoutSeconds: 30,
  },
  {
    level: 3,
    name: "Emergency Notification",
    description: "Continued unresponsiveness",
    actions: ["Notify emergency contacts", "Share live location", "Audio recording"],
    timeoutSeconds: 60,
  },
  {
    level: 4,
    name: "Full Escalation",
    description: "Critical safety threshold",
    actions: ["Contact emergency services", "Continuous location sharing", "Silent alarm"],
    timeoutSeconds: 0,
  },
]

interface AutoEscalationSystemProps {
  safetyScore: number
  isActive: boolean
  onDismiss?: () => void
  onPause?: () => void
}

export function AutoEscalationSystem({ safetyScore, isActive, onDismiss, onPause }: AutoEscalationSystemProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isEscalating, setIsEscalating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [completedActions, setCompletedActions] = useState<string[]>([])

  // Determine escalation level based on safety score
  useEffect(() => {
    if (!isActive) return

    if (safetyScore < 30) {
      setCurrentLevel(3) // Critical
      setTimeRemaining(60)
      setIsEscalating(true)
    } else if (safetyScore < 40) {
      setCurrentLevel(2) // High concern
      setTimeRemaining(30)
      setIsEscalating(true)
    } else if (safetyScore < 50) {
      setCurrentLevel(1) // Moderate concern
      setTimeRemaining(15)
      setIsEscalating(true)
    } else {
      setIsEscalating(false)
      setCurrentLevel(0)
    }
  }, [safetyScore, isActive])

  // Countdown timer
  useEffect(() => {
    if (!isEscalating || isPaused || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-escalate to next level
          if (currentLevel < escalationLevels.length - 1) {
            const nextLevel = currentLevel + 1
            setCurrentLevel(nextLevel)
            setTimeRemaining(escalationLevels[nextLevel].timeoutSeconds)

            // Execute actions for current level
            const actions = escalationLevels[currentLevel].actions
            setCompletedActions((prev) => [...prev, ...actions])
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isEscalating, isPaused, timeRemaining, currentLevel])

  const handleDismiss = () => {
    setIsEscalating(false)
    setCurrentLevel(0)
    setTimeRemaining(0)
    setCompletedActions([])
    onDismiss?.()
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
    onPause?.()
  }

  const handleEmergencyCall = () => {
    // India emergency number
    if (typeof window !== "undefined") {
      window.location.href = "tel:112"
    }
    setCompletedActions((prev) => [...prev, "Emergency call initiated"])
  }

  const handleContactNotification = () => {
    // Stub: send SMS/WhatsApp/email with live location link if available
    const locationLink = navigator.geolocation
      ? new Promise<string>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords
              resolve(`https://maps.google.com/?q=${latitude},${longitude}`)
            },
            () => resolve("Location unavailable")
          )
        })
      : Promise.resolve("Location unavailable")

    locationLink.then((link) => {
      console.log("SOS sent to contacts with location:", link)
    })
    setCompletedActions((prev) => [...prev, "Emergency contacts notified"])
  }

  if (!isEscalating) return null

  const currentEscalation = escalationLevels[currentLevel]
  const progressPercentage =
    currentEscalation.timeoutSeconds > 0
      ? ((currentEscalation.timeoutSeconds - timeRemaining) / currentEscalation.timeoutSeconds) * 100
      : 100

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-warning/20 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-warning animate-pulse-warning" />
              </div>
              <div>
                <CardTitle className="text-base text-warning">{currentEscalation.name}</CardTitle>
                <Badge variant="outline" className="mt-1 border-warning/20 text-warning">
                  Level {currentLevel + 1} of {escalationLevels.length}
                </Badge>
              </div>
            </div>
            {currentLevel === 0 && (
              <Button variant="ghost" size="icon" onClick={handleDismiss}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Safety Score */}
          <div className="bg-warning/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Safety Score</span>
              <span className="text-lg font-bold text-warning">{safetyScore}</span>
            </div>
            <p className="text-xs text-muted-foreground">{currentEscalation.description}</p>
          </div>

          {/* Countdown Timer */}
          {timeRemaining > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto-escalation in:</span>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-lg font-mono text-warning">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              {!isPaused && (
                <p className="text-xs text-center text-muted-foreground">Tap "I'm Safe" to cancel escalation</p>
              )}
            </div>
          )}

          {/* Current Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Active Safety Measures:</h4>
            {currentEscalation.actions.map((action, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-safe flex-shrink-0" />
                <span className="text-sm">{action}</span>
              </div>
            ))}
          </div>

          {/* Completed Actions */}
          {completedActions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-safe">Completed Actions:</h4>
              {completedActions.map((action, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-safe flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{action}</span>
                </div>
              ))}
            </div>
          )}

          {/* Emergency Actions */}
          {currentLevel >= 2 && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleContactNotification}
                className="haptic-pulse bg-transparent"
                disabled={completedActions.includes("Emergency contacts notified")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Notify Contacts
              </Button>
              <Button
                variant="destructive"
                onClick={handleEmergencyCall}
                className="haptic-pulse"
                disabled={completedActions.includes("Emergency call initiated")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call 911
              </Button>
            </div>
          )}

          {/* Control Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handlePause}
              className="haptic-pulse bg-transparent"
              disabled={currentLevel >= 3}
            >
              <Pause className="w-4 h-4 mr-2" />
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button onClick={handleDismiss} className="bg-safe hover:bg-safe/90 text-safe-foreground haptic-pulse">
              <Shield className="w-4 h-4 mr-2" />
              I'm Safe
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              Your location and safety status are being monitored. Emergency contacts will receive your live location if
              escalation continues. You can cancel at any time by confirming you're safe.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
