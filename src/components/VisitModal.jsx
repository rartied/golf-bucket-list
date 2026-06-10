import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function VisitModal({ course, onClose, onSave, onUnvisit }) {
  const [date, setDate] = useState(
    course.visited_date || new Date().toISOString().split('T')[0]
  )
  const [score, setScore] = useState(course.round_score || '')
  const [notes, setNotes] = useState(course.visit_notes || '')
  const [photos, setPhotos] = useState(course.visit_photos || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleFiles(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)

    const uploaded = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${course.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('visit-photos').upload(path, file)
      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('visit-photos')
          .getPublicUrl(path)
        uploaded.push(publicUrl)
      }
    }

    setPhotos(prev => [...prev, ...uploaded])
    setUploading(false)
    e.target.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await onSave({
      visited: true,
      visited_date: date || null,
      round_score: score.trim() || null,
      visit_notes: notes.trim() || null,
      visit_photos: photos,
    })
    setSaving(false)
    onClose()
  }

  async function handleUnvisit() {
    if (!window.confirm('Remove this visit log?')) return
    await onUnvisit()
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {course.visited ? 'Edit Visit' : 'Log Visit'} — {course.name}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="visit-row">
              <div className="form-group">
                <label className="form-label">Date Visited</label>
                <input
                  className="form-input"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Round Score</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. 82"
                  value={score}
                  onChange={e => setScore(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="How was it? Any memorable moments?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Photos</label>
              {photos.length > 0 && (
                <div className="visit-photos-grid">
                  {photos.map((url, i) => (
                    <div key={i} className="visit-photo-thumb">
                      <img src={url} alt="" />
                      <button
                        type="button"
                        className="remove-photo-btn"
                        onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className={`upload-btn ${uploading ? 'uploading' : ''}`}>
                {uploading ? 'Uploading…' : '+ Upload photos'}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFiles}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="modal-footer visit-modal-footer">
            {course.visited && (
              <button
                type="button"
                className="btn-unvisit"
                onClick={handleUnvisit}
              >
                Remove visit
              </button>
            )}
            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-save"
                disabled={saving || uploading}
              >
                {saving ? 'Saving…' : 'Log Visit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
