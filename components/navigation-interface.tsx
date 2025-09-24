"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { NavigationMap } from "@/components/navigation-map"
import { VoiceGuidance } from "@/components/voice-guidance"
import { SafetyAlert } from "@/components/safety-alert"
import { AutoEscalationSystem } from "@/components/auto-escalation-system"
import { Navigation, Shield, Clock, MapPin, AlertTriangle, Phone, Pause, Play, X } from "lucide-react"
import { useGeolocation } from "@/hooks/use-geolocation"

interface NavigationStep {
  id: string
  instruction: string
  distance: string
  safetyScore: number
  estimatedTime: string
  warnings: string[]
  improvements: string[]
}

const mockSteps: NavigationStep[] = [
  {
    id: "1",
    instruction: "Head north on Oak Street",
    distance: "0.2 mi",
    safetyScore: 78,
    estimatedTime: "3 min",
    warnings: [],
    improvements: ["Well-lit sidewalk", "Active area"],
  },
  {
    id: "2",
    instruction: "Turn right on Main Street",
    distance: "0.4 mi",
    safetyScore: 82,
    estimatedTime: "5 min",
    warnings: [],
    improvements: ["Excellent lighting", "CCTV coverage"],
  },
  {
    id: "3",
    instruction: "Continue straight through downtown",
    distance: "0.2 mi",
    safetyScore: 32, // lowered safety score to trigger escalation
    estimatedTime: "3 min",
    warnings: ["Construction area ahead", "Reduced lighting", "Recent incident reports"],
    improvements: ["Shorter route available"],
  },
]

export function NavigationInterface() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isNavigating, setIsNavigating] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [showEscalation, setShowEscalation] = useState(false)
  const [progress, setProgress] = useState(25)
  const [timeRemaining, setTimeRemaining] = useState("8 min")
  const [distanceRemaining, setDistanceRemaining] = useState("0.6 mi")
  const [lastSafetyUpdate, setLastSafetyUpdate] = useState<Date>(new Date())
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null)
  const [routeGeom, setRouteGeom] = useState<{ lat: number; lng: number }[] | null>(null)
  const { coords } = useGeolocation()

  const currentStepData = mockSteps[currentStep]
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const geom = sessionStorage.getItem("selected_route_geom")
      const dest = sessionStorage.getItem("destination_point")
      if (geom) setRouteGeom(JSON.parse(geom))
      if (dest) setDestination(JSON.parse(dest))
    } catch {}
  }, [])

  // Simulate navigation progress and safety updates
  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2
          if (newProgress >= 100) {
            setIsNavigating(false)
            return 100
          }
          return newProgress
        })

        // Simulate step progression
        if (progress > 40 && currentStep === 0) {
          setCurrentStep(1)
        } else if (progress > 70 && currentStep === 1) {
          setCurrentStep(2)
          setShowAlert(true) // Show alert for low safety score
          setTimeout(() => {
            setShowEscalation(true)
          }, 3000)
        }

        // Update time and distance
        const remaining = Math.max(0, 8 - Math.floor(progress / 12.5))
        setTimeRemaining(`${remaining} min`)
        setDistanceRemaining(`${(0.8 - (progress / 100) * 0.8).toFixed(1)} mi`)

        // Simulate periodic safety score timestamp
        setLastSafetyUpdate(new Date())
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isNavigating, progress, currentStep])

  const handlePauseResume = () => {
    setIsNavigating(!isNavigating)
  }

  const handleEndNavigation = () => {
    window.location.href = "/dashboard"
  }

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

  return (
    <div className="min-h-screen bg-background relative">
      {/* Auto-Escalation System */}
      {showEscalation && (
        <AutoEscalationSystem
          safetyScore={currentStepData.safetyScore}
          isActive={showEscalation}
          onDismiss={() => setShowEscalation(false)}
          onPause={() => setIsNavigating(!isNavigating)}
        />
      )}

      {/* Safety Alert Overlay */}
      {showAlert && !showEscalation && (
        <SafetyAlert
          score={currentStepData.safetyScore}
          warnings={currentStepData.warnings}
          onDismiss={() => setShowAlert(false)}
          onReroute={() => {
            setShowAlert(false)
            // Simulate rerouting
            setCurrentStep(1)
          }}
        />
      )}

      {/* Map Area */}
      <div className="h-1/2 relative">
        <NavigationMap currentStep={currentStep} safetyScore={currentStepData.safetyScore} destination={destination} />

        {/* Map Overlay Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Button variant="ghost" size="icon" className="bg-card/80 backdrop-blur-sm" onClick={handleEndNavigation}>
            <X className="w-5 h-5" />
          </Button>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <Shield className={`w-4 h-4 ${getSafetyColor(currentStepData.safetyScore)}`} />
              <span className={`text-sm font-medium ${getSafetyColor(currentStepData.safetyScore)}`}>
                {currentStepData.safetyScore}
              </span>
              <span className="text-xs text-muted-foreground">· Updated {Math.max(1, Math.round((Date.now()-lastSafetyUpdate.getTime())/1000))}s ago</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="h-1/2 p-4 space-y-4 overflow-y-auto">
        {/* Current Step */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-safe/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Navigation className="w-5 h-5 text-safe" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-lg text-balance">{currentStepData.instruction}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{currentStepData.distance}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{currentStepData.estimatedTime}</span>
                  </div>
                  <Badge
                    className={`${getSafetyBg(currentStepData.safetyScore)} ${getSafetyColor(currentStepData.safetyScore)}`}
                  >
                    Safety {currentStepData.safetyScore}
                  </Badge>
                  {currentStepData.safetyScore < 50 && (
                    <Button size="sm" className="ml-auto bg-warning text-warning-foreground" onClick={() => setShowAlert(true)}>
                      Reroute
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Summary */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-safe">{timeRemaining}</div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{distanceRemaining}</div>
                <div className="text-xs text-muted-foreground">Distance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warnings & Improvements */}
        {(currentStepData.warnings.length > 0 || currentStepData.improvements.length > 0) && (
          <Card className="border-border">
            <CardContent className="p-4 space-y-3">
              {currentStepData.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-warning">Current Alerts</h4>
                  {currentStepData.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentStepData.improvements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-safe">Safety Features</h4>
                  {currentStepData.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-safe mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{improvement}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Voice Guidance */}
        <VoiceGuidance
          isEnabled={voiceEnabled}
          onToggle={() => setVoiceEnabled(!voiceEnabled)}
          currentInstruction={currentStepData.instruction}
        />

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handlePauseResume}
            className="flex items-center space-x-2 haptic-pulse bg-transparent"
          >
            {isNavigating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isNavigating ? "Pause" : "Resume"}</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2 haptic-pulse bg-transparent" onClick={() => setShowEscalation(true)}>
            <Phone className="w-4 h-4" />
            <span>SOS</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
