"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, VolumeX, Mic, MicOff } from "lucide-react"

interface VoiceGuidanceProps {
  isEnabled: boolean
  onToggle: () => void
  currentInstruction: string
}

export function VoiceGuidance({ isEnabled, onToggle, currentInstruction }: VoiceGuidanceProps) {
  const [isListening, setIsListening] = useState(false)
  const [lastSpoken, setLastSpoken] = useState<string | null>(null)

  // Simulate voice guidance
  useEffect(() => {
    if (isEnabled && currentInstruction !== lastSpoken) {
      setLastSpoken(currentInstruction)
      // In a real app, this would use speech synthesis
      console.log(`Speaking: ${currentInstruction}`)
    }
  }, [isEnabled, currentInstruction, lastSpoken])

  const handleVoiceCommand = () => {
    setIsListening(!isListening)
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        // Simulate recognized command
        console.log("Voice command recognized: What's my safety score?")
      }, 2000)
    }
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Voice Guidance</h3>
          <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
            {isEnabled ? "Active" : "Disabled"}
          </Badge>
        </div>

        <div className="space-y-3">
          {/* Voice Output Control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isEnabled ? (
                <Volume2 className="w-4 h-4 text-safe" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm">Audio Instructions</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              {isEnabled ? "Disable" : "Enable"}
            </Button>
          </div>

          {/* Voice Input Control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isListening ? (
                <Mic className="w-4 h-4 text-safe animate-pulse" />
              ) : (
                <MicOff className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm">Voice Commands</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceCommand}
              className={isListening ? "voice-active" : ""}
            >
              {isListening ? "Listening..." : "Ask"}
            </Button>
          </div>

          {/* Last Instruction */}
          {isEnabled && lastSpoken && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Last spoken:</p>
              <p className="text-sm">{lastSpoken}</p>
            </div>
          )}

          {/* Voice Commands Help */}
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">Try saying:</p>
            <ul className="space-y-1 ml-2">
              <li>• "What's my safety score?"</li>
              <li>• "Find a safer route"</li>
              <li>• "Call emergency contact"</li>
              <li>• "Repeat last instruction"</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
