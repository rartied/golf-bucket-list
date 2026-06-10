function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function DiaryCard({ course, onEdit }) {
  const photos = course.visit_photos?.length ? course.visit_photos : []
  const coursePhoto = course.images?.[0]
  const heroPhoto = photos[0] || coursePhoto
  const extraPhotos = photos.slice(1, 4)

  return (
    <div className="diary-card" onClick={() => onEdit(course)}>
      {heroPhoto && (
        extraPhotos.length > 0 ? (
          <div className="diary-photos">
            <img src={heroPhoto} alt="" className="diary-photo" />
            {extraPhotos.map((url, i) => (
              <img key={i} src={url} alt="" className="diary-photo" />
            ))}
          </div>
        ) : (
          <img src={heroPhoto} alt="" className="diary-hero" />
        )
      )}

      <div className="diary-body">
        <div className="diary-meta">
          {course.visited_date
            ? <span className="diary-date">{formatDate(course.visited_date)}</span>
            : <span />}
          {course.round_score && (
            <span className="diary-score">{course.round_score}</span>
          )}
        </div>
        <div className="diary-name">{course.name}</div>
        {course.location && (
          <div className="diary-location">📍 {course.location}</div>
        )}
        {course.visit_notes && (
          <div className="diary-notes">{course.visit_notes}</div>
        )}
      </div>
    </div>
  )
}
