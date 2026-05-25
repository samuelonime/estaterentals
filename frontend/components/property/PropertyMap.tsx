'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink, Navigation } from 'lucide-react'

interface PropertyMapProps {
  latitude: number
  longitude: number
  title: string
  address: string
}

export function PropertyMap({ latitude, longitude, title, address }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      // Fix default marker icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [latitude, longitude],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Custom orange pin
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:36px;height:44px;position:relative;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
          ">
            <svg viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z" fill="#f97316"/>
              <circle cx="18" cy="18" r="8" fill="white"/>
              <circle cx="18" cy="18" r="5" fill="#f97316"/>
            </svg>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44],
      })

      const marker = L.marker([latitude, longitude], { icon }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px; padding: 4px 0;">
          <p style="font-weight: 700; font-size: 13px; margin: 0 0 4px; color: #0f172a;">${title}</p>
          <p style="font-size: 11px; color: #64748b; margin: 0;">${address}</p>
        </div>
      `).openPopup()
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, title, address])

  return (
    <div className="space-y-3">
      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-0"
        style={{ position: 'relative' }}
      />

      {/* Action buttons */}
      <div className="flex gap-3">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-xl text-sm font-medium transition-all border border-slate-200 dark:border-slate-700"
        >
          <ExternalLink className="w-4 h-4" />
          Open in Google Maps
        </a>
        <a
          href={streetViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-medium transition-all border border-slate-200 dark:border-slate-700"
        >
          <Navigation className="w-4 h-4" />
          Street View
        </a>
      </div>
    </div>
  )
}
