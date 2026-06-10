import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import ListView from './components/ListView'
import MapView from './components/MapView'
import AddCourseModal from './components/AddCourseModal'
import VisitModal from './components/VisitModal'
import DiaryView from './components/DiaryView'
import CourseDetailModal from './components/CourseDetailModal'
import TabBar from './components/TabBar'
import './App.css'

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const [view, setView] = useState('list')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [visitingCourse, setVisitingCourse] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    const { data, error } = await supabase
      .from('golf_courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setCourses(data || [])
    setLoading(false)
  }

  async function addCourse(course) {
    const { data, error } = await supabase
      .from('golf_courses')
      .insert([course])
      .select()

    if (error) return { error }
    setCourses(prev => [data[0], ...prev])
    return { error: null }
  }

  async function updateCourse(id, updates) {
    const { data, error } = await supabase
      .from('golf_courses')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) return { error }
    setCourses(prev => prev.map(c => c.id === id ? data[0] : c))
    return { error: null }
  }

  async function deleteCourse(id) {
    const { error } = await supabase
      .from('golf_courses')
      .delete()
      .eq('id', id)

    if (!error) setCourses(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="app">
      <Header
        view={view}
        setView={setView}
        onAdd={() => setShowModal(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
      <main className="main">
        {loading ? (
          <div className="center-state">Loading your bucket list...</div>
        ) : error ? (
          <div className="center-state error-state">
            <p>Could not connect to database.</p>
            <p className="error-detail">{error}</p>
            <p className="error-detail">Check that your .env file has the correct Supabase credentials.</p>
          </div>
        ) : view === 'list' ? (
          <ListView
            courses={courses.filter(c => !c.visited)}
            onSelect={setSelectedCourse}
            onVisit={setVisitingCourse}
          />
        ) : view === 'map' ? (
          <MapView courses={courses.filter(c => !c.visited)} />
        ) : (
          <DiaryView
            courses={courses.filter(c => c.visited)}
            onEdit={setVisitingCourse}
          />
        )}
      </main>
      <button className="fab mobile-only" onClick={() => setShowModal(true)}>+</button>
      <TabBar view={view} setView={setView} />
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEdit={c => { setSelectedCourse(null); setEditingCourse(c) }}
          onDelete={async id => { await deleteCourse(id); setSelectedCourse(null) }}
          onVisit={c => { setSelectedCourse(null); setVisitingCourse(c) }}
        />
      )}
      {visitingCourse && (
        <VisitModal
          course={visitingCourse}
          onClose={() => setVisitingCourse(null)}
          onSave={(data) => updateCourse(visitingCourse.id, data)}
          onUnvisit={() => updateCourse(visitingCourse.id, {
            visited: false, visited_date: null, round_score: null,
            visit_notes: null, visit_photos: [],
          })}
        />
      )}
      {(showModal || editingCourse) && (
        <AddCourseModal
          course={editingCourse}
          onClose={() => { setShowModal(false); setEditingCourse(null) }}
          onSave={editingCourse
            ? (data) => updateCourse(editingCourse.id, data)
            : addCourse
          }
        />
      )}
    </div>
  )
}
