import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapView({ courses }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    mapRef.current = L.map(containerRef.current, {
      center: [25, 10],
      zoom: 2,
      minZoom: 2,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(mapRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const icon = L.divIcon({
      className: 'golf-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -32],
    })

    courses
      .filter(c => c.lat != null && c.lng != null)
      .forEach(course => {
        const imgHtml = course.images?.[0]
          ? `<img src="${course.images[0]}" style="width:100%;height:110px;object-fit:cover;border-radius:6px;margin-bottom:8px;display:block;" />`
          : ''

        const linkHtml = course.website_url
          ? `<a href="${course.website_url}" target="_blank" rel="noopener noreferrer"
               style="color:#2a6e14;font-size:0.8rem;font-weight:600;text-decoration:none;">
               Visit site ↗
             </a>`
          : ''

        const notesHtml = course.notes
          ? `<p style="margin:4px 0 6px;color:#6e6e73;font-size:0.78rem;line-height:1.4;">${course.notes}</p>`
          : ''

        const popupContent = `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-width:180px;">
            ${imgHtml}
            <strong style="font-size:0.92rem;display:block;margin-bottom:2px;">${course.name}</strong>
            ${course.location ? `<span style="color:#6e6e73;font-size:0.78rem;">${course.location}</span>` : ''}
            ${notesHtml}
            ${linkHtml}
          </div>
        `

        const marker = L.marker([course.lat, course.lng], { icon })
          .addTo(mapRef.current)
          .bindPopup(popupContent, { maxWidth: 220 })

        markersRef.current.push(marker)
      })
  }, [courses])

  return <div ref={containerRef} className="map-view" />
}
