export interface LatLng {
  lat: number
  lng: number
}

export interface GeocodeResult {
  displayName: string
  lat: number
  lon: number
}

export async function geocodeNominatim(query: string): Promise<GeocodeResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Tamil Nadu, India')}`
  const res = await fetch(url, { headers: { "Accept-Language": "en" } })
  if (!res.ok) throw new Error("Geocoding failed")
  const data = await res.json()
  return (data || []).slice(0, 5).map((d: any) => ({
    displayName: d.display_name,
    lat: parseFloat(d.lat),
    lon: parseFloat(d.lon),
  }))
}

export interface OsrmRoute {
  distanceMeters: number
  durationSeconds: number
  geometry: number[][]
}

function decodePolyline(polyline: string): number[][] {
  // OSRM polyline6
  let index = 0, lat = 0, lng = 0, coordinates: number[][] = []
  while (index < polyline.length) {
    let b, shift = 0, result = 0
    do {
      b = polyline.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1))
    lat += dlat

    shift = 0
    result = 0
    do {
      b = polyline.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1))
    lng += dlng

    coordinates.push([lat / 1e5, lng / 1e5])
  }
  return coordinates
}

export async function osrmRoute(start: LatLng, end: LatLng): Promise<OsrmRoute> {
  const coords = `${start.lng},${start.lat};${end.lng},${end.lat}`
  const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=polyline&alternatives=true&steps=false`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Routing failed")
  const data = await res.json()
  if (!data.routes?.length) throw new Error("No route found")
  const best = data.routes[0]
  return {
    distanceMeters: best.distance,
    durationSeconds: best.duration,
    geometry: decodePolyline(best.geometry),
  }
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${Math.round(meters)} m`
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}


