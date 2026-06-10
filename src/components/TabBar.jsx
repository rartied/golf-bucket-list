import { List, Map, BookOpen } from 'lucide-react'

export default function TabBar({ view, setView }) {
  return (
    <nav className="tab-bar">
      <button
        className={`tab-item ${view === 'list' ? 'active' : ''}`}
        onClick={() => setView('list')}
      >
        <span className="tab-icon"><List size={20} /></span>
        <span>Bucket List</span>
      </button>
      <button
        className={`tab-item ${view === 'map' ? 'active' : ''}`}
        onClick={() => setView('map')}
      >
        <span className="tab-icon"><Map size={20} /></span>
        <span>Map</span>
      </button>
      <button
        className={`tab-item ${view === 'diary' ? 'active' : ''}`}
        onClick={() => setView('diary')}
      >
        <span className="tab-icon"><BookOpen size={20} /></span>
        <span>Diary</span>
      </button>
    </nav>
  )
}
