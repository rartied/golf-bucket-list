import { useState } from 'react'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'

export default function CourseDetailModal({ course, onClose, onEdit, onDelete, onVisit }) {
  const [imgError, setImgError] = useState(false)
  const firstImage = course.images?.[0]
  const showImage = firstImage && !imgError

  function handleDelete() {
    if (window.confirm(`Remove "${course.name}" from your bucket list?`)) {
      onDelete(course.id)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal detail-modal">
        {showImage ? (
          <img
            src={firstImage}
            alt={course.name}
            className="detail-hero"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="detail-hero-placeholder">⛳</div>
        )}

        <button className="detail-close-btn" onClick={onClose}>×</button>

        <div className="detail-body">
          <div className="detail-name">{course.name}</div>

          {(course.location || course.region) && (
            <div className="detail-meta">
              {course.location && <span>📍 {course.location}</span>}
              {course.region && <span className="detail-region">{course.region}</span>}
            </div>
          )}

          {course.notes && (
            <p className="detail-notes">{course.notes}</p>
          )}
        </div>

        <div className="detail-actions">
          {course.website_url && (
            <a
              href={course.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-site-btn"
            >
              <ExternalLink size={15} />
              Visit site
            </a>
          )}
          <div className="detail-right-actions">
            <button className="detail-icon-btn" onClick={() => onEdit(course)} title="Edit">
              <Pencil size={16} />
            </button>
            <button className="detail-icon-btn danger" onClick={handleDelete} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
