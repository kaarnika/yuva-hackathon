"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, MapPin, Users, Bell, ChevronRight, Check } from "lucide-react"

const steps = [
  {
    id: "welcome",
    title: "Welcome to SafeWalk",
    description: "Your AI-powered companion for safer solo travel",
    icon: Shield,
  },
  {
    id: "location",
    title: "Location Access",
    description: "We need your location to provide real-time safety guidance",
    icon: MapPin,
  },
  {
    id: "contacts",
    title: "Emergency Contacts",
    description: "Add trusted contacts for automatic safety notifications",
    icon: Users,
  },
  {
    id: "preferences",
    title: "Safety Preferences",
    description: "Customize your safety thresholds and notification settings",
    icon: Bell,
  },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [emergencyContacts, setEmergencyContacts] = useState(["", ""])
  const [safetyThreshold, setSafetyThreshold] = useState(60)

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding - redirect to main app
      window.location.href = "/dashboard"
    }
  }

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location access granted:", position.coords)
          handleNext()
        },
        (error) => {
          console.error("Location access denied:", error)
          // Still proceed for demo purposes
          handleNext()
        },
      )
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-colors ${index <= currentStep ? "bg-safe" : "bg-muted"}`}
            />
          ))}
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-safe/10 rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-safe" />
            </div>
            <div>
              <CardTitle className="text-xl text-balance">{currentStepData.title}</CardTitle>
              <CardDescription className="text-muted-foreground text-pretty">
                {currentStepData.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    SafeWalk uses AI to analyze real-time safety data and guide you on the safest routes.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-safe/10 rounded-lg mx-auto flex items-center justify-center">
                      <Shield className="w-6 h-6 text-safe" />
                    </div>
                    <p className="text-xs text-muted-foreground">Real-time Safety Scores</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-safe/10 rounded-lg mx-auto flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-safe" />
                    </div>
                    <p className="text-xs text-muted-foreground">Smart Route Planning</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-safe/10 rounded-lg mx-auto flex items-center justify-center">
                      <Bell className="w-6 h-6 text-safe" />
                    </div>
                    <p className="text-xs text-muted-foreground">Proactive Alerts</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Location access enables real-time safety scoring and route optimization.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-safe" />
                    <span className="text-sm">Continuous safety monitoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-safe" />
                    <span className="text-sm">Proactive route adjustments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-safe" />
                    <span className="text-sm">Emergency location sharing</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact1">Primary Emergency Contact</Label>
                    <Input
                      id="contact1"
                      type="tel"
                      placeholder="Enter phone number"
                      value={emergencyContacts[0]}
                      onChange={(e) => setEmergencyContacts([e.target.value, emergencyContacts[1]])}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact2">Secondary Emergency Contact</Label>
                    <Input
                      id="contact2"
                      type="tel"
                      placeholder="Enter phone number (optional)"
                      value={emergencyContacts[1]}
                      onChange={(e) => setEmergencyContacts([emergencyContacts[0], e.target.value])}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Contacts will be notified automatically if your Safety Score drops critically low and you don't
                    respond to alerts.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>Safety Score Threshold</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conservative (70+)</span>
                      <span>Balanced (50+)</span>
                      <span>Flexible (30+)</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="70"
                      value={safetyThreshold}
                      onChange={(e) => setSafetyThreshold(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center">
                      <span className="text-sm font-medium">Current: {safetyThreshold}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Routes below this score will trigger alternative suggestions and enhanced monitoring.
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={currentStep === 1 ? handleLocationAccess : handleNext}
              className="w-full bg-safe hover:bg-safe/90 text-safe-foreground haptic-pulse"
              size="lg"
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>

            {currentStep > 0 && (
              <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} className="w-full">
                Back
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
