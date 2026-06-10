import { Sun, Moon } from 'lucide-react'

export default function Header({ view, setView, onAdd, isDark, toggleTheme }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Golf Bucket List</h1>
      </div>

      <div className="header-right">
        {/* Desktop only — mobile uses the bottom TabBar */}
        <div className="view-toggle desktop-only">
          <button
            className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            List
          </button>
          <button
            className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
            onClick={() => setView('map')}
          >
            Map
          </button>
          <button
            className={`toggle-btn ${view === 'diary' ? 'active' : ''}`}
            onClick={() => setView('diary')}
          >
            Diary
          </button>
        </div>

        {/* Desktop add button only */}
        <button className="add-btn desktop-only" onClick={onAdd}>
          <span>+</span>
          <span className="btn-text">Add Course</span>
        </button>

        {/* Theme toggle — always visible */}
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  )
}
