import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const OPTIONS = [
  {
    group: 'Sort',
    items: [
      { value: 'recent', label: 'Recent' },
      { value: 'az', label: 'A – Z' },
      { value: 'za', label: 'Z – A' },
    ],
  },
  {
    group: 'Group by',
    items: [
      { value: 'region', label: 'Region' },
      { value: 'state', label: 'State / Province' },
    ],
  },
]

function findLabel(value) {
  for (const g of OPTIONS) {
    const item = g.items.find(i => i.value === value)
    if (item) return item.label
  }
  return value
}

export default function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('touchstart', handle)
    }
  }, [])

  const isGrouping = value === 'region' || value === 'state'

  return (
    <div className="filter-dd" ref={ref}>
      <button
        className={`filter-dd-btn${open ? ' open' : ''}${isGrouping ? ' active' : ''}`}
        onClick={() => setOpen(p => !p)}
      >
        <span>{findLabel(value)}</span>
        <ChevronDown
          size={13}
          className={`filter-dd-chevron${open ? ' rotated' : ''}`}
        />
      </button>

      {open && (
        <div className="filter-dd-menu">
          {OPTIONS.map(({ group, items }) => (
            <div key={group} className="filter-dd-group">
              <div className="filter-dd-group-label">{group}</div>
              {items.map(item => (
                <button
                  key={item.value}
                  className={`filter-dd-item${value === item.value ? ' selected' : ''}`}
                  onClick={() => { onChange(item.value); setOpen(false) }}
                >
                  <span>{item.label}</span>
                  {value === item.value && <span className="filter-dd-tick">✓</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
