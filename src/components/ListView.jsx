import { useState, useMemo } from 'react'
import CourseCard from './CourseCard'
import FilterDropdown from './FilterDropdown'

function sortCourses(courses, filter) {
  if (filter === 'az') return [...courses].sort((a, b) => a.name.localeCompare(b.name))
  if (filter === 'za') return [...courses].sort((a, b) => b.name.localeCompare(a.name))
  return [...courses]
}

function groupBy(courses, key) {
  const map = {}
  courses.forEach(c => {
    const g = c[key] || 'Other'
    if (!map[g]) map[g] = []
    map[g].push(c)
  })
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
}

export default function ListView({ courses, onSelect, onVisit }) {
  const [filter, setFilter] = useState('recent')

  const isGrouped = filter === 'region' || filter === 'state'

  const content = useMemo(() => {
    if (filter === 'region') return groupBy(courses, 'region')
    if (filter === 'state') return groupBy(courses, 'state')
    return sortCourses(courses, filter)
  }, [courses, filter])

  if (courses.length === 0) {
    return (
      <div className="list-view">
        <div className="empty-state">
          <h2>Your bucket list is empty</h2>
          <p>Hit "Add Course" to log your first dream destination</p>
        </div>
      </div>
    )
  }

  return (
    <div className="list-view">
      <div className="list-controls">
        <FilterDropdown value={filter} onChange={setFilter} />
      </div>

      {isGrouped ? (
        <div className="courses-list-grouped">
          {content.map(([groupName, groupCourses]) => (
            <div key={groupName} className="course-group">
              <h3 className="course-group-heading">{groupName}</h3>
              <div className="courses-grid">
                {groupCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onSelect={onSelect}
                    onVisit={onVisit}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="courses-grid">
          {content.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelect}
              onVisit={onVisit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
