import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import AboutLinks from './AboutLinks'
import yaetypeShot from './assets/yaetypeSS.png'
import { cvHref, links } from './links'
import blueLogo from './assets/bluelogo.png'
import orangeLogo from './assets/orangelogo.png'
import pinkLogo from './assets/pinklogo.png'

const themes = [
  { name: 'pink', color: '#df32aa', logo: pinkLogo },
  { name: 'ember', color: '#ff4b18', logo: orangeLogo },
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
    title: 'YAETYPE',
    summary:
      'A typing trainer built around fast restarts, real word tests, and modes that keep practice from feeling like a drill.',
    language: 'NEXT.JS',
    href: 'https://yaetype.jorgesimoes.com',
    image: yaetypeShot,
    overview:
      'A typing test that stays out of your way. One line of text, instant restart on enter, and four ways to run a session: classic for a straight test, survival for pressure, multiplayer for racing someone, and custom for setting your own rules. Accounts keep your history so progress is measurable instead of a number you forget.',
    reason:
      'Every trainer I tried buried the test under settings or made mistakes feel punishing. I wanted one calm enough to sit in front of for an hour, so the interface holds a single focus point and everything else steps back until you ask for it.',
    meta: [
      ['ROLE', 'FULLSTACK DEVELOPER'],
      ['STACK', 'NEXT.JS / REACT / JAVASCRIPT'],
      ['BACKEND', 'DATABASE / LOGIN SYSTEM'],
      ['STATUS', 'LIVE / V1.2.0'],
    ],
  },
]
const contactIntro = {
  label: 'AVAILABLE',
  statement: 'Looking for an internship for my third year.',
  text:
    'Open to front-end and fullstack work in the Netherlands. The fastest way to reach me is email — I answer everything.',
}
const contactChannels = [
  { label: 'EMAIL', value: links.email, href: `mailto:${links.email}` },
  { label: 'LINKEDIN', value: 'JORGE SIMOES', href: links.linkedin, external: true },
  { label: 'GITHUB', value: 'YAEKUZA', href: links.github, external: true },
  { label: 'CV', value: 'DOWNLOAD PDF', href: cvHref, download: true },
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

function ContactHeader({ phase }) {
  return (
    <header
      className={`projects-list-header ${phase === 'out' ? 'is-exiting' : 'is-entering'}`}
    >
      <h1>CONTACT</h1>
      <span className="projects-sector">SECTOR 04</span>
      <span className="projects-list-rule" aria-hidden="true" />
    </header>
  )
}

function ContactView({ phase }) {
  return (
    <section className={`view-layer contact-view page-phase-${phase}`} id="contact">
      <ContactHeader phase={phase} />

      <div className="contact-body">
        <div className="contact-intro">
          <span className="contact-label">{contactIntro.label}</span>
          <h2 className="contact-statement">{contactIntro.statement}</h2>
          <p className="contact-lead">{contactIntro.text}</p>
        </div>

        <div className="contact-channels">
          {contactChannels.map((channel) => (
            <a
              className="contact-channel"
              href={channel.href}
              key={channel.label}
              {...(channel.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              {...(channel.download ? { download: 'Jorge Simoes CV.pdf' } : {})}
            >
              <span className="contact-channel-label">{channel.label}</span>
              <span className="contact-channel-value">{channel.value}</span>
              <span className="contact-channel-mark" aria-hidden="true">
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
          <AboutLinks />
        </div>

        <Suspense fallback={null}>
          <AboutModel />
        </Suspense>

        <p className="about-lead">{aboutProfile.text}</p>
      </div>
    </section>
  )
}

function ProjectDetail({ project, onBack }) {
  return (
    <article className="project-detail">
      <button type="button" className="project-back" onClick={onBack}>
        <span className="project-back-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        BACK
      </button>

      <header className="project-detail-head">
        <h2>{project.title}</h2>
        <a
          className="project-detail-link"
          href={project.href}
          target="_blank"
          rel="noreferrer"
        >
          {project.href.replace('https://', '')}
        </a>
      </header>

      <div className="project-detail-body">
        <div className="project-detail-text">
          <section className="project-detail-block">
            <span className="project-detail-label">OVERVIEW</span>
            <p>{project.overview}</p>
          </section>

          <section className="project-detail-block">
            <span className="project-detail-label">WHY IT WAS MADE</span>
            <p>{project.reason}</p>
          </section>
        </div>

        <div className="project-detail-side">
          <figure className="project-detail-shot">
            <img src={project.image} alt={`${project.title} interface`} />
          </figure>

          <div className="project-detail-meta">
            {project.meta.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function ProjectsView({ phase }) {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [filterPhase, setFilterPhase] = useState('idle')
  const [activeProject, setActiveProject] = useState(null)
  const [swapPhase, setSwapPhase] = useState('idle')
  const filterTimeoutRef = useRef()
  const filterResetTimeoutRef = useRef()
  const swapTimeoutRef = useRef()
  const swapResetTimeoutRef = useRef()
  const filteredProjects =
    activeFilter === 'ALL'
      ? projects
      : projects.filter((project) => project.language === activeFilter)
  const listPhase = swapPhase === 'out' ? 'out' : filterPhase

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

  const handleSwap = useCallback(
    (project) => {
      if (swapPhase !== 'idle') {
        return
      }

      window.clearTimeout(swapTimeoutRef.current)
      window.clearTimeout(swapResetTimeoutRef.current)
      setSwapPhase('out')

      swapTimeoutRef.current = window.setTimeout(() => {
        setActiveProject(project)
        setSwapPhase('in')
      }, 340)

      swapResetTimeoutRef.current = window.setTimeout(() => {
        setSwapPhase('idle')
      }, 900)
    },
    [swapPhase],
  )

  useEffect(
    () => () => {
      window.clearTimeout(filterTimeoutRef.current)
      window.clearTimeout(filterResetTimeoutRef.current)
      window.clearTimeout(swapTimeoutRef.current)
      window.clearTimeout(swapResetTimeoutRef.current)
    },
    [],
  )

  return (
    <section className={`view-layer projects-view page-phase-${phase}`} id="projects">
      <ProjectsHeader phase={phase} />

      <div className={`projects-list-view is-${swapPhase}`}>
        {activeProject ? (
          <ProjectDetail project={activeProject} onBack={() => handleSwap(null)} />
        ) : (
          <>
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

            <div className={`project-list is-${listPhase}`}>
              {filteredProjects.map((project, index) => (
                <button
                  type="button"
                  className="project-row"
                  key={project.title}
                  onClick={() => handleSwap(project)}
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
                </button>
              ))}
            </div>
          </>
        )}
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
      if (!pages.includes(page)) {
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
      ) : view === 'contact' ? (
        <ContactView phase={transitionPhase} />
      ) : view === 'projects' ? (
        <ProjectsView phase={transitionPhase} />
      ) : (
        <HomeView activeTheme={activeTheme} transitioning={transitionPhase === 'out'} />
      )}
    </main>
  )
}

export default App
