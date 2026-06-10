import { useState } from 'react'
import { CheckCircle, Circle } from 'lucide-react'

export default function CourseCard({ course, onSelect, onVisit }) {
  const [imgError, setImgError] = useState(false)
  const firstImage = course.images?.[0]
  const showImage = firstImage && !imgError

  return (
    <div className="course-card" onClick={() => onSelect(course)}>
      <div className="card-media">
        {showImage ? (
          <img
            src={firstImage}
            alt={course.name}
            className="card-image"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-placeholder">⛳</div>
        )}
        <button
          className={`visit-toggle ${course.visited ? 'is-visited' : ''}`}
          onClick={e => { e.stopPropagation(); onVisit(course) }}
          title={course.visited ? 'View visit log' : 'Mark as visited'}
        >
          {course.visited ? <CheckCircle size={22} /> : <Circle size={22} />}
        </button>
      </div>

      <div className="card-body">
        <div className="card-name">{course.name}</div>
        {course.location && (
          <div className="card-location">{course.location}</div>
        )}
        {course.visited && course.visited_date && (
          <div className="visit-info">
            ✓ {new Date(course.visited_date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
            {course.round_score && <span className="visit-score"> · {course.round_score}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
