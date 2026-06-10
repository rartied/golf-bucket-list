import { useState } from 'react'
import DiaryCard from './DiaryCard'
import MapView from './MapView'

export default function DiaryView({ courses, onEdit }) {
  const [subView, setSubView] = useState('list')

  return (
    <div className="diary-view-wrapper">
      <div className="diary-sub-header">
        <button
          className={`sub-toggle-btn ${subView === 'list' ? 'active' : ''}`}
          onClick={() => setSubView('list')}
        >
          List
        </button>
        <button
          className={`sub-toggle-btn ${subView === 'map' ? 'active' : ''}`}
          onClick={() => setSubView('map')}
        >
          Map
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <h2>No rounds logged yet</h2>
          <p>Check off a course you've played to start your diary</p>
        </div>
      ) : subView === 'map' ? (
        <MapView courses={courses} />
      ) : (
        <div className="diary-list">
          {courses.map(course => (
            <DiaryCard key={course.id} course={course} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
