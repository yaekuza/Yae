import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import profileImage from './assets/Media (27).jpg'
import blueLogo from './assets/bluelogo.png'
import orangeLogo from './assets/orangelogo.png'
import pinkLogo from './assets/pinklogo.png'

const themes = [
  { name: 'ember', color: '#ff4b18', logo: orangeLogo },
  { name: 'pink', color: '#df32aa', logo: pinkLogo },
  { name: 'violet', color: '#5517ff', logo: blueLogo },
]
const themeLogoSources = themes.map((theme) => theme.logo)

const AboutModel = lazy(() => import('./AboutModel'))

const pages = ['home', 'about', 'projects', 'contact']
const aboutProfile = {
  name: 'JORGE SIMOES',
  role: 'Software Developer',
  text:
    'I am 18, born in Portugal and currently living in the Netherlands for school and work. Right now everything I do points at front-end development, and I plan on becoming a pro in that field, so most of my time goes into learning how interfaces are structured, how they move, and why some of them feel better than others. Outside of that you will find me bouldering or taking photos. I am currently looking for an internship for my third year.',
}
const projects = [
  {
    title: 'PORTFOLIO INTERFACE SYSTEM',
    summary:
      'A motion-focused portfolio shell with themed navigation, portrait composition, and sharp page transitions.',
    language: 'REACT',
  },
  {
    title: 'VISUAL ASSET PIPELINE',
    summary:
      'A small image workflow for preparing expressive assets that stay crisp inside the interface.',
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
      'A personal profile layout balancing direct text, theme color hierarchy, and editorial portrait work.',
    language: 'HTML',
  },
  {
    title: 'RESPONSIVE VISUAL LAYOUT',
    summary:
      'A responsive front-end experiment for keeping dense visual sections readable across viewport sizes.',
    language: 'CSS',
  },
]
const projectFilters = ['ALL', ...Array.from(new Set(projects.map((project) => project.language)))]

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
        <LedBar />
        <ThemeSelector activeThemeName={activeThemeName} onThemeSelect={onThemeSelect} />
      </div>
    </nav>
  )
}

function HeroName({ logo }) {
  return (
    <h1 className="hero-name">
      <span className="hero-first">
        JORGE
      </span>
      <span className="hero-last">
        SIM<img className="hero-logo" src={logo} alt="O" loading="eager" decoding="sync" fetchPriority="high" />ES
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

function ProjectsHeader({ phase }) {
  return (
    <header className={`projects-list-header ${phase === 'out' ? 'is-exiting' : 'is-entering'}`}>
      <h1>PROJECTS</h1>
      <span className="projects-sector">SECTOR 03</span>
      <span className="projects-list-rule" aria-hidden="true" />
    </header>
  )
}

function AboutHeader({ phase }) {
  return (
    <header
      className={`projects-list-header about-list-header ${
        phase === 'out' ? 'is-exiting' : 'is-entering'
      }`}
    >
      <span className="about-sector">sec-02</span>
      <h1>ABOUT</h1>
      <span className="projects-list-rule" aria-hidden="true" />
    </header>
  )
}

function AboutView({ phase }) {
  return (
    <section className={`view-layer about-view page-phase-${phase}`} id="about">
      <AboutHeader phase={phase} />

      <div className="about-body">
        <div className="about-identity">
          <h2 className="about-name">
            <span>{aboutProfile.name}</span>
          </h2>
          <p className="about-role">{aboutProfile.role}</p>
        </div>

        <Suspense fallback={null}>
          <AboutModel />
        </Suspense>

        <figure className="about-portrait" aria-label="Portrait of Jorge Simoes">
          <img className="about-portrait-image" src={profileImage} alt="Jorge Simoes" />
          <div className="portrait-cover" aria-hidden="true">
            <span className="portrait-pixel-arrow">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
          </div>
        </figure>

        <p className="about-lead">{aboutProfile.text}</p>
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
      <ProjectsHeader phase={phase} />

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

  useEffect(() => {
    themeLogoSources.forEach((logoSource) => {
      const image = new Image()
      image.decoding = 'sync'
      image.src = logoSource
    })
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
