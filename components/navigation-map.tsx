"use client"
import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import { MapPin, Navigation } from "lucide-react"
import { useGeolocation, isWithinTamilNadu } from "@/hooks/use-geolocation"

interface NavigationMapProps {
  currentStep: number
  safetyScore: number
  destination?: { lat: number; lng: number } | null
}

const tamilNaduCenter: [number, number] = [11.1271, 78.6569]

const userIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%2322c55e'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [center, map])
  return null
}

export function NavigationMap({ currentStep, safetyScore, destination = null }: NavigationMapProps) {
  const { coords } = useGeolocation()
  const start: [number, number] | null = useMemo(() => {
    if (coords && isWithinTamilNadu({ latitude: coords.latitude, longitude: coords.longitude })) {
      return [coords.latitude, coords.longitude]
    }
    return null
  }, [coords])

  const routeLine = useMemo(() => {
    const points: [number, number][] = []
    const origin = start ?? [tamilNaduCenter[0] - 0.05, tamilNaduCenter[1]]
    const dest = destination ? [destination.lat, destination.lng] : [tamilNaduCenter[0] + 0.05, tamilNaduCenter[1] + 0.05]
    points.push(origin)
    points.push([(origin[0] + (dest as [number, number])[0]) / 2 + 0.03, (origin[1] + (dest as [number, number])[1]) / 2])
    points.push(dest as [number, number])
    return points
  }, [start, destination])

  const safetyColor = safetyScore >= 70 ? "#22c55e" : safetyScore >= 50 ? "#f59e0b" : "#ef4444"

  return (
    <div className="w-full h-full relative">
      <MapContainer center={start ?? tamilNaduCenter} zoom={start ? 14 : 7} className="w-full h-full" scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {start && <Recenter center={start} />}
        {start && <Marker position={start} icon={userIcon} />}
        {destination && <Marker position={[destination.lat, destination.lng]} />}
        <Polyline positions={routeLine} pathOptions={{ color: safetyColor, weight: 6, opacity: 0.9 }} />
      </MapContainer>

      <div className="absolute top-4 right-4 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center">
        <Navigation className="w-6 h-6 text-muted-foreground" />
      </div>
    </div>
  )
}
