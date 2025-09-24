"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SafetyScoreWidget } from "@/components/safety-score-widget"
import { RouteCard } from "@/components/route-card"
import { MapPin, Navigation, Clock, Shield, Mic, MicOff, Search, Target, Settings } from "lucide-react"
import { geocodeNominatim, osrmRoute, formatDistance, formatDuration } from "@/lib/routing"
import { useGeolocation, isWithinTamilNadu } from "@/hooks/use-geolocation"

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

const mockRoutes: Route[] = [
  {
    id: "1",
    name: "Main Street Route",
    duration: "12 min",
    distance: "0.8 mi",
    safetyScore: 78,
    factors: {
      crime: 85,
      lighting: 90,
      traffic: 70,
      timeOfDay: 65,
    },
    warnings: [],
    improvements: ["Well-lit sidewalks", "Active pedestrian area", "Regular police patrols"],
  },
  {
    id: "2",
    name: "Park Path",
    duration: "10 min",
    distance: "0.7 mi",
    safetyScore: 54,
    factors: {
      crime: 45,
      lighting: 30,
      traffic: 85,
      timeOfDay: 55,
    },
    warnings: ["Poor lighting after 8 PM", "Recent incident reports"],
    improvements: ["Shorter distance", "Less traffic noise"],
  },
  {
    id: "3",
    name: "Commercial District",
    duration: "15 min",
    distance: "1.1 mi",
    safetyScore: 82,
    factors: {
      crime: 90,
      lighting: 95,
      traffic: 75,
      timeOfDay: 70,
    },
    warnings: [],
    improvements: ["Excellent lighting", "24/7 business activity", "CCTV coverage"],
  },
]

export function RoutePlanning() {
  const [destination, setDestination] = useState("")
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [showRoutes, setShowRoutes] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [routeMode, setRouteMode] = useState<"safe" | "fastest">("safe")
  const { coords, isLoading } = useGeolocation()
  const [isFetching, setIsFetching] = useState(false)
  const [routes, setRoutes] = useState<typeof mockRoutes>(mockRoutes)

  const startAddress = useMemo(() => {
    if (coords && isWithinTamilNadu({ latitude: coords.latitude, longitude: coords.longitude })) {
      return `Lat ${coords.latitude.toFixed(4)}, Lng ${coords.longitude.toFixed(4)}`
    }
    return isLoading ? "Detecting location..." : "Location outside Tamil Nadu"
  }, [coords, isLoading])

  const handleSearch = async () => {
    if (!destination.trim()) return
    setIsFetching(true)
    try {
      const start = coords ? { lat: coords.latitude, lng: coords.longitude } : null
      const geos = await geocodeNominatim(destination)
      if (!geos.length || !start) {
        setShowRoutes(true)
        setLastUpdated(new Date())
        setIsFetching(false)
        return
      }
      const end = { lat: geos[0].lat, lng: geos[0].lon }
      const r = await osrmRoute(start, end)
      // Synthesize two options: "Safe" slightly longer and "Fastest" as-is
      const fastest = {
        id: "fastest",
        name: "Fastest Route",
        duration: formatDuration(r.durationSeconds),
        distance: formatDistance(r.distanceMeters),
        safetyScore: 65,
        factors: { crime: 70, lighting: 70, traffic: 75, timeOfDay: 60 },
        warnings: [],
        improvements: ["Direct path"],
      }
      const safe = {
        id: "safe",
        name: "Safer Route",
        duration: formatDuration(r.durationSeconds * 1.15),
        distance: formatDistance(r.distanceMeters * 1.1),
        safetyScore: 82,
        factors: { crime: 85, lighting: 90, traffic: 70, timeOfDay: 70 },
        warnings: [],
        improvements: ["Well-lit areas", "Active streets"],
      }
      setRoutes([safe, fastest])
      // Persist for navigation screen
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "selected_route_geom",
          JSON.stringify(r.geometry.map(([la, ln]) => ({ lat: la, lng: ln })))
        )
        sessionStorage.setItem("destination_point", JSON.stringify(end))
      }
      setShowRoutes(true)
      setLastUpdated(new Date())
    } catch (e) {
      setShowRoutes(true)
      setLastUpdated(new Date())
    } finally {
      setIsFetching(false)
    }
  }

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive)
    // Simulate voice recognition
    if (!isVoiceActive) {
      setTimeout(() => {
        setDestination("Central Library")
        setIsVoiceActive(false)
      }, 2000)
    }
  }

  const handleStartNavigation = () => {
    if (selectedRoute) {
      window.location.href = "/navigation"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-safe/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-safe" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">SafeWalk</h1>
                <p className="text-sm text-muted-foreground">Plan your safe route</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Location */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-safe/10 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-safe" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-xs text-muted-foreground">{startAddress}</p>
              </div>
              <Badge variant="secondary" className="bg-safe/10 text-safe border-safe/20">
                Safe Area
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Destination Input */}
        <Card className="border-border">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Where would you like to go?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10 pr-12"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 ${
                    isVoiceActive ? "voice-active bg-safe/10 text-safe" : ""
                  }`}
                  onClick={handleVoiceToggle}
                >
                  {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {isVoiceActive && (
              <div className="flex items-center justify-center space-x-2 py-2">
                <div className="w-2 h-2 bg-safe rounded-full animate-pulse-safe" />
                <span className="text-sm text-muted-foreground">Listening...</span>
                <div className="w-2 h-2 bg-safe rounded-full animate-pulse-safe" style={{ animationDelay: "0.2s" }} />
              </div>
            )}

            <Button
              onClick={handleSearch}
              className="w-full bg-safe hover:bg-safe/90 text-safe-foreground haptic-pulse"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Find Safe Routes
            </Button>
          </CardContent>
        </Card>

        {/* Route Options */}
        {showRoutes && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Route Options</h2>
              <div className="flex items-center space-x-2">
                <div className="flex rounded-full overflow-hidden border border-border">
                  <Button variant={routeMode === "safe" ? "secondary" : "ghost"} size="sm" onClick={() => setRouteMode("safe")}>Safe</Button>
                  <Button variant={routeMode === "fastest" ? "secondary" : "ghost"} size="sm" onClick={() => setRouteMode("fastest")}>Fastest</Button>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {lastUpdated ? `Updated ${Math.max(1, Math.round((Date.now()-lastUpdated.getTime())/1000))}s ago` : "Just now"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {(routes || []).map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isSelected={selectedRoute === route.id}
                  onSelect={() => setSelectedRoute(route.id)}
                />
              ))}
            </div>

            {/* Safety Score Explanation */}
            <SafetyScoreWidget />

            {/* Start Navigation */}
            {selectedRoute && (
              <div className="sticky bottom-4">
                <Button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("selected_route_id", selectedRoute || "")
                    }
                    handleStartNavigation()
                  }}
                  className="w-full bg-safe hover:bg-safe/90 text-safe-foreground haptic-pulse"
                  size="lg"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Start Navigation
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!showRoutes && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <MapPin className="w-5 h-5" />
                <span className="text-xs">Nearby Safe Spots</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Shield className="w-5 h-5" />
                <span className="text-xs">Safety Report</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
