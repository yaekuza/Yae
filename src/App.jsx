import { memo, useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import profileAscii from './assets/profile-ascii.txt?raw'
import blueLogo from './assets/bluelogo.png'
import orangeLogo from './assets/orangelogo.png'
import pinkLogo from './assets/pinklogo.png'

const themes = [
  { name: 'ember', color: '#ff4b18', logo: orangeLogo },
  { name: 'pink', color: '#df32aa', logo: pinkLogo },
  { name: 'violet', color: '#5517ff', logo: blueLogo },
]

const pages = ['home', 'about', 'projects', 'contact']
const asciiRows = 25
const asciiColumns = 50
const asciiInventory = ['J', 'O', 'R', 'G', 'E', '/', '>', '.', '']
const asciiCells = Array.from({ length: asciiRows * asciiColumns }, (_, index) => getAsciiUnit(index))
const projects = [
  {
    title: 'PORTFOLIO INTERFACE SYSTEM',
    summary:
      'A motion-focused portfolio shell with themed navigation, ASCII portrait work, and sharp page transitions.',
    language: 'REACT',
  },
  {
    title: 'ASCII IMAGE PIPELINE',
    summary:
      'A small conversion workflow that turns project images into terminal-style ASCII compositions.',
    language: 'NODE',
  },
  {
    title: 'MENU MOTION STUDY',
    summary:
      'A CSS animation pass focused on smoother transforms, fast reveals, and menu-like hover states.',
    language: 'CSS',
  },
  {
    title: 'THEME SWITCHER',
    summary:
      'A compact color system that swaps logo assets and accent colors across the interface.',
    language: 'JAVASCRIPT',
  },
  {
    title: 'ABOUT PAGE COMPOSITION',
    summary:
      'A personal profile layout balancing direct text, theme color hierarchy, and generated ASCII imagery.',
    language: 'HTML',
  },
  {
    title: 'RESPONSIVE ASCII LAYOUT',
    summary:
      'A responsive front-end experiment for keeping dense text art readable across viewport sizes.',
    language: 'CSS',
  },
]
const projectFilters = ['ALL', ...Array.from(new Set(projects.map((project) => project.language)))]

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
          <span className="page-index">{String(index + 1).padStart(2, '0')}</span>
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

function PortfolioMenu({ activeThemeName, onNavigate, onThemeSelect, onOpenChange }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef()

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

  useEffect(() => {
    onOpenChange(open)
  }, [onOpenChange, open])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
    }
  }, [open])

  return (
    <nav
      ref={menuRef}
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
    <pre className="about-ascii-image" aria-label="ASCII portrait of Jorge Simoes">
      {profileAscii}
    </pre>
  )
})

function HeroName({ logo }) {
  return (
    <h1 className="hero-name">
      <span className="hero-first">
        JORGE
      </span>
      <span className="hero-last">
        SIM<img className="hero-logo" src={logo} alt="O" />ES
      </span>
    </h1>
  )
}

function HomeView({ activeTheme, transitioning }) {
  return (
    <section className={`view-layer home-view ${transitioning ? 'is-transitioning' : ''}`}>
      <HeroName logo={activeTheme.logo} />
    </section>
  )
}

function SectionHeader({ number, title, sector, phase }) {
  return (
    <header className={`section-header ${phase === 'out' ? 'is-exiting' : 'is-entering'}`}>
      <span className="section-rule section-rule-top" aria-hidden="true" />
      <div className="section-title-block">
        <span className="section-number">{number}</span>
        <h1>{title}</h1>
      </div>
      <span className="section-sector">{sector}</span>
      <span className="section-rule section-rule-bottom" aria-hidden="true" />
    </header>
  )
}

function ProjectsHeader({ count, phase }) {
  return (
    <header className={`projects-list-header ${phase === 'out' ? 'is-exiting' : 'is-entering'}`}>
      <h1>PROJECTS</h1>
      <span className="projects-count">{String(count).padStart(2, '0')}</span>
      <span className="projects-list-rule" aria-hidden="true" />
    </header>
  )
}

function AboutView({ phase }) {
  return (
    <section className={`view-layer about-view page-phase-${phase}`} id="about">
      <SectionHeader number="02" title="ABOUT" sector="SEC-02" phase={phase} />

      <div className="about-body">
        <div className="about-copy">
          <span className="about-kicker">JORGE SIMOES</span>
          <h2>JORGE SIMOES</h2>
          <p>
            I am a software development student currently in my third year, with a focus on
            front-end development. I care about clear visual hierarchy, smooth interaction, and
            interfaces that feel precise.
          </p>
          <p>Outside of development, I spend my time bouldering, taking photos, and gaming.</p>
        </div>
        <AsciiPortrait />
      </div>
    </section>
  )
}

function ProjectsView({ phase }) {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [filterPhase, setFilterPhase] = useState('idle')
  const filterTimeoutRef = useRef()
  const filterResetTimeoutRef = useRef()
  const filteredProjects =
    activeFilter === 'ALL'
      ? projects
      : projects.filter((project) => project.language === activeFilter)
  const handleFilterSelect = useCallback(
    (filter) => {
      if (filter === activeFilter || filterPhase !== 'idle') {
        return
      }

      window.clearTimeout(filterTimeoutRef.current)
      window.clearTimeout(filterResetTimeoutRef.current)
      setFilterPhase('out')

      filterTimeoutRef.current = window.setTimeout(() => {
        setActiveFilter(filter)
        setFilterPhase('in')
      }, 360)

      filterResetTimeoutRef.current = window.setTimeout(() => {
        setFilterPhase('idle')
      }, 780)
    },
    [activeFilter, filterPhase],
  )

  return (
    <section className={`view-layer projects-view page-phase-${phase}`} id="projects">
      <ProjectsHeader count={filteredProjects.length} phase={phase} />

      <div className="projects-list-view">
        <div className="project-filters" aria-label="Project language filters">
          {projectFilters.map((filter) => (
            <button
              type="button"
              className={activeFilter === filter ? 'is-active' : ''}
              onClick={() => handleFilterSelect(filter)}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={`project-list is-${filterPhase}`}>
          {filteredProjects.map((project, index) => (
            <a
              className="project-row"
              href="#projects"
              key={project.title}
              style={{
                '--project-row-index': index,
                '--project-row-out-index': filteredProjects.length - index - 1,
              }}
            >
              <span className="project-row-title">{project.title}</span>
              <span className="project-row-summary">{project.summary}</span>
              <span className="project-row-language">{project.language}</span>
              <span className="project-row-mark" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function App() {
  const [activeThemeName, setActiveThemeName] = useState(themes[1].name)
  const [view, setView] = useState('home')
  const [transitionPhase, setTransitionPhase] = useState('idle')
  const [menuOpen, setMenuOpen] = useState(false)
  const activeTheme = themes.find((theme) => theme.name === activeThemeName) ?? themes[1]

  const handleThemeSelect = useCallback((themeName) => {
    setActiveThemeName(themeName)
  }, [])

  const handleNavigate = useCallback(
    (page) => {
      if (page !== 'home' && page !== 'about' && page !== 'projects') {
        return
      }

      if (page === view) {
        return
      }

      setTransitionPhase('out')

      window.setTimeout(() => {
        setView(page)
        setTransitionPhase(page === 'home' ? 'idle' : 'in')
      }, 420)

      window.setTimeout(() => {
        setTransitionPhase('idle')
      }, 900)
    },
    [view],
  )

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const preventPageScroll = (event) => {
      event.preventDefault()
    }

    window.addEventListener('wheel', preventPageScroll, { passive: false, capture: true })
    window.addEventListener('touchmove', preventPageScroll, { passive: false, capture: true })

    return () => {
      window.removeEventListener('wheel', preventPageScroll, { capture: true })
      window.removeEventListener('touchmove', preventPageScroll, { capture: true })
    }
  }, [menuOpen])

  return (
    <main
      className={`portfolio-page theme-${activeThemeName} ${menuOpen ? 'menu-is-open' : ''}`}
      aria-label="Jorge Simoes portfolio"
    >
      <PortfolioMenu
        activeThemeName={activeThemeName}
        onNavigate={handleNavigate}
        onOpenChange={setMenuOpen}
        onThemeSelect={handleThemeSelect}
      />
      {view === 'about' ? (
        <AboutView phase={transitionPhase} />
      ) : view === 'projects' ? (
        <ProjectsView phase={transitionPhase} />
      ) : (
        <HomeView activeTheme={activeTheme} transitioning={transitionPhase === 'out'} />
      )}
    </main>
  )
}

export default App
