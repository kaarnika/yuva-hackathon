"use client"

import { useEffect, useState } from "react"

export interface Coordinates {
  latitude: number
  longitude: number
  accuracy?: number
}

interface GeolocationState {
  coords: Coordinates | null
  error: string | null
  isLoading: boolean
}

// Rough bounding box for Tamil Nadu
const TAMIL_NADU_BBOX = {
  minLat: 8.0,
  maxLat: 13.6,
  minLng: 76.2,
  maxLng: 80.3,
}

export function isWithinTamilNadu({ latitude, longitude }: Coordinates): boolean {
  return (
    latitude >= TAMIL_NADU_BBOX.minLat &&
    latitude <= TAMIL_NADU_BBOX.maxLat &&
    longitude >= TAMIL_NADU_BBOX.minLng &&
    longitude <= TAMIL_NADU_BBOX.maxLng
  )
}

export function useGeolocation(options?: PositionOptions): GeolocationState {
  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported")
      setIsLoading(false)
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setIsLoading(false)
      },
      (err) => {
        setError(err.message)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
        ...options,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return { coords, error, isLoading }
}


