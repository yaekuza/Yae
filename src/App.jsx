import { memo, useCallback, useState } from 'react'
import './App.css'
import profileAscii from './assets/profile-ascii.txt?raw'
import aboutImage from './assets/img7.png'

const themes = [
  { name: 'ember', color: '#ff4b18' },
  { name: 'pink', color: '#df32aa' },
  { name: 'violet', color: '#5517ff' },
]

const pages = ['about', 'projects', 'contact']
const asciiRows = 25
const asciiColumns = 50
const asciiInventory = ['J', 'O', 'R', 'G', 'E', '/', '>', '.', '']
const asciiCells = Array.from({ length: asciiRows * asciiColumns }, (_, index) => getAsciiUnit(index))

function getAsciiUnit(index, offset = 0) {
  return asciiInventory[(index * 5 + Math.floor(index / asciiColumns) * 3 + offset) % asciiInventory.length]
}

const MenuIcon = memo(function MenuIcon({ open }) {
  return (
    <span className={`menu-icon ${open ? 'is-open' : ''}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  )
})

const PageList = memo(function PageList({ onNavigate }) {
  return (
    <div className="page-list">
      {pages.map((page, index) => (
        <a
          className="page-link"
          href={`#${page}`}
          key={page}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onNavigate(page)
          }}
        >
          <span className="page-index">{String(index + 2).padStart(2, '0')}</span>
          <span>{page}</span>
        </a>
      ))}
    </div>
  )
})

const AsciiGrid = memo(function AsciiGrid() {
  return (
    <div className="ascii-grid" aria-hidden="true">
      {asciiCells.map((cell, index) => (
        <span key={index}>{cell}</span>
      ))}
    </div>
  )
})

const LedBar = memo(function LedBar() {
  return (
    <div className="led-bar" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
})

const ThemeSelector = memo(function ThemeSelector({ activeThemeName, onThemeSelect }) {
  return (
    <div className="theme-selector" aria-label="Colour theme selector">
      {themes.map((theme) => (
        <button
          type="button"
          className={activeThemeName === theme.name ? 'is-active' : ''}
          style={{ '--swatch-color': theme.color }}
          aria-label={`${theme.name} colour theme`}
          key={theme.name}
          onClick={(event) => {
            event.stopPropagation()
            onThemeSelect(theme.name)
          }}
        />
      ))}
    </div>
  )
})

function PortfolioMenu({ activeThemeName, onNavigate, onThemeSelect }) {
  const [open, setOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setOpen((current) => !current)
  }, [])

  const handleNavigate = useCallback(
    (page) => {
      onNavigate(page)
      setOpen(false)
    },
    [onNavigate],
  )

  return (
    <nav
      className={`portfolio-menu theme-${activeThemeName} ${open ? 'is-open' : ''}`}
      aria-label="Primary navigation"
      onClick={toggleMenu}
    >
      <div className="menu-top">
        <span className="menu-mark" aria-hidden="true">
          &gt;|&lt;
        </span>
        <MenuIcon open={open} />
        <span className="menu-label">MENU</span>
      </div>

      <div className="menu-content" aria-hidden={!open}>
        <PageList onNavigate={handleNavigate} />
        <AsciiGrid />
        <LedBar />
        <ThemeSelector activeThemeName={activeThemeName} onThemeSelect={onThemeSelect} />
      </div>
    </nav>
  )
}

const AsciiPortrait = memo(function AsciiPortrait() {
  return (
    <pre className="ascii-portrait" aria-label="ASCII portrait of Jorge Simoes">
      {profileAscii}
    </pre>
  )
})

function HeroName() {
  return <h1 className="hero-name">JORGE SIMOES</h1>
}

function HomeView({ transitioning }) {
  return (
    <section className={`view-layer home-view ${transitioning ? 'is-transitioning' : ''}`}>
      <AsciiPortrait />
      <HeroName />
    </section>
  )
}

function AboutView({ transitioning }) {
  return (
    <section className={`view-layer about-view ${transitioning ? 'is-entering' : ''}`} id="about">
      <div className="about-copy">
        <span className="about-kicker">ABOUT</span>
        <h1>JORGE SIMOES</h1>
        <p>
          I am a software development student currently in my third year, with a focus on
          front-end development. I care about clear visual hierarchy, smooth interaction, and
          interfaces that feel precise.
        </p>
        <p>Outside of development, I spend my time bouldering, taking photos, and gaming.</p>
      </div>

      <img className="about-image" src={aboutImage} alt="Visual reference from Jorge Simoes" />
    </section>
  )
}

function App() {
  const [activeThemeName, setActiveThemeName] = useState(themes[1].name)
  const [view, setView] = useState('home')
  const [transitioning, setTransitioning] = useState(false)

  const handleThemeSelect = useCallback((themeName) => {
    setActiveThemeName(themeName)
  }, [])

  const handleNavigate = useCallback(
    (page) => {
      if (page !== 'about') {
        return
      }

      if (page === view) {
        return
      }

      setTransitioning(true)

      window.setTimeout(() => {
        setView(page)
      }, 420)

      window.setTimeout(() => {
        setTransitioning(false)
      }, 900)
    },
    [view],
  )

  return (
    <main className={`portfolio-page theme-${activeThemeName}`} aria-label="Jorge Simoes portfolio">
      <PortfolioMenu
        activeThemeName={activeThemeName}
        onNavigate={handleNavigate}
        onThemeSelect={handleThemeSelect}
      />
      {view === 'about' ? (
        <AboutView transitioning={transitioning} />
      ) : (
        <HomeView transitioning={transitioning} />
      )}
    </main>
  )
}

export default App
