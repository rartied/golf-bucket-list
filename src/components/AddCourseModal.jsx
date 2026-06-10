import { useState } from 'react'
import { regionFromCountryCode } from '../lib/regions'

async function geocodeLocation(location) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1&addressdetails=1`,
      { headers: { 'User-Agent': 'GolfBucketList/1.0' } }
    )
    const data = await res.json()
    if (data.length > 0) {
      const countryCode = data[0].address?.country_code
      const addr = data[0].address || {}
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        region: regionFromCountryCode(countryCode),
        state: addr.state || addr.province || addr.region || null,
      }
    }
    return null
  } catch {
    return null
  }
}

export default function AddCourseModal({ onClose, onSave, course }) {
  const editing = Boolean(course)
  const [name, setName] = useState(course?.name || '')
  const [location, setLocation] = useState(course?.location || '')
  const [images, setImages] = useState(course?.images?.length ? course.images : [''])
  const [websiteUrl, setWebsiteUrl] = useState(course?.website_url || '')
  const [notes, setNotes] = useState(course?.notes || '')
  const [geoStatus, setGeoStatus] = useState(course?.lat ? 'success' : null)
  const [geoResult, setGeoResult] = useState(
    course?.lat ? { lat: course.lat, lng: course.lng, region: course.region } : null
  )
  const [saving, setSaving] = useState(false)

  async function handleLocationBlur() {
    if (!location.trim()) return
    setGeoStatus('loading')
    const result = await geocodeLocation(location)
    if (result) {
      setGeoResult(result)
      setGeoStatus('success')
    } else {
      setGeoResult(null)
      setGeoStatus('notfound')
    }
  }

  function updateImage(i, val) {
    setImages(prev => prev.map((v, idx) => idx === i ? val : v))
  }

  function removeImage(i) {
    setImages(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)

    let result = geoResult
    if (location.trim() && !result) {
      result = await geocodeLocation(location)
    }

    const { error } = await onSave({
      name: name.trim(),
      location: location.trim() || null,
      region: result?.region ?? null,
      state: result?.state ?? null,
      lat: result?.lat ?? null,
      lng: result?.lng ?? null,
      images: images.filter(u => u.trim()),
      website_url: websiteUrl.trim() || null,
      notes: notes.trim() || null,
    })

    setSaving(false)
    if (!error) onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{editing ? 'Edit Course' : 'Add Golf Course'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Course Name <span className="required">*</span>
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Augusta National Golf Club"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Augusta, Georgia, USA"
                value={location}
                onChange={e => {
                  setLocation(e.target.value)
                  setGeoStatus(null)
                  setGeoResult(null)
                }}
                onBlur={handleLocationBlur}
              />
              <div className={`geocode-hint ${geoStatus || ''}`}>
                {geoStatus === 'loading' && 'Locating on map…'}
                {geoStatus === 'success' && `✓ Located${geoResult?.region ? ` · ${geoResult.region}` : ''}`}
                {geoStatus === 'notfound' && "Couldn't locate — won't appear on map"}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Website URL</label>
              <input
                className="form-input"
                type="url"
                placeholder="https://www.example.com"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Images</label>
              {images.map((url, i) => (
                <div key={i} className="image-row">
                  <input
                    className="form-input"
                    type="url"
                    placeholder="Paste image URL"
                    value={url}
                    onChange={e => updateImage(i, e.target.value)}
                  />
                  {images.length > 1 && (
                    <button type="button" className="rm-img-btn" onClick={() => removeImage(i)}>
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-img-btn" onClick={() => setImages(p => [...p, ''])}>
                + Add another image
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Why is this on your bucket list?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={saving || !name.trim()}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
