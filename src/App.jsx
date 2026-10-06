import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import AboutLinks from './AboutLinks'
import yaetypeShot from './assets/yaetypeSS.png'
import melographShot from './assets/Melograph.png'
import melostudioShot from './assets/melostudio.png'
import ariaShot from './assets/Aria.png'
import { cvHref, cvHrefNL, links } from './links'
import blueLogo from './assets/bluelogo.png'
import orangeLogo from './assets/orangelogo.png'
import pinkLogo from './assets/pinklogo.png'
import contactPhoto1 from './assets/img1.png'
import contactPhoto2 from './assets/img2.png'
import contactPhoto7 from './assets/img7.png'

const themes = [
  { name: 'pink', color: '#df32aa', logo: pinkLogo },
  { name: 'ember', color: '#ff4b18', logo: orangeLogo },
  { name: 'violet', color: '#5517ff', logo: blueLogo },
]
const themeLogoSources = themes.map((theme) => theme.logo)

const AboutModel = lazy(() => import('./AboutModel'))

const pages = ['home', 'about', 'projects', 'contact']
const NAV_OUT_DURATION = 420
const NAV_SETTLE_DURATION = 900
const HOME_LOGO_SCROLL_RANGE = 1200
const HOME_LOGO_HANDOFF_RANGE = 110
const HOME_LOGO_MIN_SCALE = 0.32
const HOME_LOGO_SHIFT_RATIO = 0.32
const HOME_SCROLL_SPEED = 0.55
const HOME_SCROLL_EASE = 0.085
const storyBlocks = [
  {
    id: 'school',
    text:
      "I'm Jorge, a front-end developer studying at Grafisch Lyceum Rotterdam. I was born in Portugal and now live in the Netherlands for school, and for the work that comes after it.",
  },
  {
    id: 'origin',
    text:
      'It started when I was around 16. One website really caught my attention, not for what it said, but for how it was built. Everything was properly calculated, the visual hierarchy just worked, and it got me thinking about how something like that is made. I wanted to try it myself, and that is what pushed me into designing and then into coding.',
  },
  {
    id: 'goal',
    text:
      "I want to be a coding engineer, though I'm still figuring out exactly where that lands. For now I'm going for front-end. Later on I might change my mind and move toward backend instead.",
  },
  {
    id: 'outside',
    text:
      "Outside of coding I really enjoy climbing, it keeps my mind and body fresh and healthy. I also love interacting with people, even though I'd say I'm somewhat of an introvert.",
  },
]
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
  {
    title: 'MELOGRAPH',
    summary:
      'A music archive where artists, charts and news sit in one browsable catalogue, built around smooth scroll and a cursor that reacts to the page.',
    language: 'NEXT.JS',
    href: 'https://melograph.vercel.app',
    image: melographShot,
    overview:
      'A music platform that treats a catalogue like something worth looking at. Artists have their own pages with their songs and videos pulled in from iTunes and YouTube, a top 20 ranks what is charting, and a news section keeps the rest. Accounts sit on top of it so you can like what you find and keep it on your profile.',
    reason:
      'A school project with a small team where I took the front-end. Most music sites hand you a grid and stop there, so I spent the time on how it moves instead: smooth scrolling, a custom cursor, a spinning record on the landing page, and page transitions that make browsing feel continuous rather than like loading documents.',
    meta: [
      ['ROLE', 'FRONT-END DEVELOPER'],
      ['STACK', 'NEXT.JS / TYPESCRIPT / SCSS'],
      ['TEAM', 'GROUP PROJECT / 3 DEVS'],
      ['STATUS', 'LIVE / SCHOOL PROJECT'],
    ],
  },
  {
    title: 'MELOSTUDIO',
    summary:
      'A browser DAW where you build a beat in the timeline, publish it, and get feedback back from other producers.',
    language: 'SOLID.JS',
    href: 'https://github.com/Gaspaco/MeloStudio',
    image: melostudioShot,
    overview:
      'Music production that runs in a tab. A studio with a timeline, piano roll, drum machine and synths on top of the Web Audio API, plus mic recording when you want to put something real on the track. Finished beats get published to a feed where other producers can listen, like and comment, so the work gets a reaction instead of sitting in a folder.',
    reason:
      'A team project where I worked on the front-end alongside another developer. Making a beat usually means installing a DAW first, and getting feedback on it means exporting and posting somewhere else entirely. Putting both in the browser removes the whole setup step, which is the part that stops people from starting.',
    meta: [
      ['ROLE', 'FRONT-END DEVELOPER'],
      ['STACK', 'SOLIDJS / TYPESCRIPT / WEB AUDIO'],
      ['TEAM', 'GROUP PROJECT / 3 DEVS'],
      ['STATUS', 'NOT DEPLOYED / SOURCE ON GITHUB'],
    ],
  },
  {
    title: 'ARIA',
    summary:
      'A health app that pairs people with a coach, where the coach writes the training and nutrition plans and the client follows them day to day.',
    language: 'REACT NATIVE',
    href: 'https://health-app-xi-five.vercel.app',
    image: ariaShot,
    overview:
      'Two apps sharing one account system. On the client side it tracks steps, sleep, runs on a map, mood and meals, with a recipe browser and a barcode scanner for logging food. On the coach side it turns into a caseload: clients request a coach, the coach accepts, then builds their workout and nutrition plans, keeps notes, watches progress and talks to them in chat.',
    reason:
      'A team project where I built the coach side. That half needed its own navigation, its own screens for assigning clients and editing their training courses, and permissions wide enough to let a coach change another account\u2019s plan without letting a client do the same, so part of the work sat in the backend rules rather than the interface.',
    meta: [
      ['ROLE', 'FRONT-END DEVELOPER / COACH APP'],
      ['STACK', 'REACT NATIVE / EXPO / TYPESCRIPT'],
      ['BACKEND', 'SUPABASE / AUTH / PERMISSIONS'],
      ['STATUS', 'LIVE / SCHOOL PROJECT'],
    ],
  },
]
const contactIntro = {
  text:
    'Open to front-end and fullstack work in the Netherlands. The fastest way to reach me is email — I answer everything.',
}
const contactPhotos = [contactPhoto7, contactPhoto2, contactPhoto1]
let lastContactPhotoIndex = -1

function pickContactPhotoIndex() {
  const index = Math.floor(Math.random() * contactPhotos.length)
  return index === lastContactPhotoIndex ? (index + 1) % contactPhotos.length : index
}
const contactChannels = [
  { label: 'EMAIL', value: links.email, href: `mailto:${links.email}` },
  { label: 'LINKEDIN', value: 'JORGE SIMOES', href: links.linkedin, external: true },
  { label: 'GITHUB', value: 'YAEKUZA', href: links.github, external: true },
  {
    label: 'CV',
    value: 'DOWNLOAD PDF',
    options: [
      { label: 'ENGLISH', href: cvHref, filename: 'Jorge Simoes CV.pdf' },
      { label: 'DUTCH', href: cvHrefNL, filename: 'Jorge Simoes CV (NL).pdf' },
    ],
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

function HeroName({ logo, logoRef }) {
  return (
    <h1 className="hero-name" aria-label="Jorge Simões">
      <span className="hero-first" aria-hidden="true">
        JORGE
      </span>
      <span className="hero-last" aria-hidden="true">
        SIM
        <img
          className="hero-logo"
          src={logo}
          alt=""
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          ref={logoRef}
        />
        ES
      </span>
    </h1>
  )
}

const ScrollIndicator = memo(function ScrollIndicator({ hidden }) {
  return (
    <div className={`scroll-indicator ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <span className="scroll-indicator-mark">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </div>
  )
})

function HomeView({ activeTheme, transitioning }) {
  const scrollRef = useRef()
  const blockRefs = useRef([])
  const heroLogoRef = useRef()
  const pinLogoRef = useRef()
  const pinLogoImgRef = useRef()
  const [scrolled, setScrolled] = useState(false)
  const [activeStoryId, setActiveStoryId] = useState(storyBlocks[0].id)

  useEffect(() => {
    const scrollEl = scrollRef.current
    const heroLogo = heroLogoRef.current
    const pinLogo = pinLogoRef.current
    const pinLogoImg = pinLogoImgRef.current

    if (!scrollEl || !heroLogo || !pinLogo || !pinLogoImg) {
      return undefined
    }

    let frame
    let originX = 0
    let originY = 0
    let startScale = HOME_LOGO_MIN_SCALE
    const narrowScreen = window.matchMedia('(max-width: 900px)')

    // Anchor the pinned logo to where the inline one actually sits inside the
    // name, which is right of centre and shifts when the webfont swaps in.
    const measureOrigin = () => {
      const heroRect = heroLogo.getBoundingClientRect()
      const pinSize = pinLogo.offsetWidth

      if (!heroRect.width || !pinSize) {
        return
      }

      originX = heroRect.left + heroRect.width / 2 - window.innerWidth / 2
      originY =
        heroRect.top + heroRect.height / 2 + scrollEl.scrollTop - window.innerHeight / 2
      startScale = heroRect.width / pinSize
    }

    const applyScrollProgress = () => {
      const scrollTop = scrollEl.scrollTop
      const progress = Math.min(1, scrollTop / HOME_LOGO_SCROLL_RANGE)
      const eased = progress * progress * (3 - 2 * progress)
      const scale = startScale + (1 - startScale) * eased
      const targetX = window.innerWidth * HOME_LOGO_SHIFT_RATIO
      const x = originX + (targetX - originX) * eased
      const y = originY * (1 - eased)
      const handoff = narrowScreen.matches
        ? 0
        : Math.min(1, scrollTop / HOME_LOGO_HANDOFF_RANGE)

      pinLogo.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      pinLogo.style.opacity = String(handoff)
      heroLogo.style.opacity = String(1 - handoff)
      pinLogoImg.style.animationPlayState = progress >= 1 ? 'paused' : 'running'

      if (scrollTop > 24) {
        setScrolled(true)
      }
    }

    const handleScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(applyScrollProgress)
    }

    const handleResize = () => {
      measureOrigin()
      applyScrollProgress()
    }

    measureOrigin()
    applyScrollProgress()
    document.fonts.ready.then(handleResize)

    scrollEl.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(frame)
      scrollEl.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const scrollEl = scrollRef.current

    if (!scrollEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let frame = null
    let target = scrollEl.scrollTop
    let current = target

    const tick = () => {
      const distance = target - current

      if (Math.abs(distance) < 0.5) {
        current = target
        scrollEl.scrollTop = current
        frame = null
        return
      }

      current += distance * HOME_SCROLL_EASE
      scrollEl.scrollTop = current
      frame = window.requestAnimationFrame(tick)
    }

    const handleWheel = (event) => {
      // The menu's own wheel lock runs first in the capture phase.
      if (event.defaultPrevented) {
        return
      }

      event.preventDefault()

      if (frame === null) {
        current = scrollEl.scrollTop
        target = current
      }

      let delta = event.deltaY

      if (event.deltaMode === 1) {
        delta *= 16
      } else if (event.deltaMode === 2) {
        delta *= scrollEl.clientHeight
      }

      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight
      target = Math.min(maxScroll, Math.max(0, target + delta * HOME_SCROLL_SPEED))

      if (frame === null) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    scrollEl.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }

      scrollEl.removeEventListener('wheel', handleWheel)
    }
  }, [])

  useEffect(() => {
    const scrollEl = scrollRef.current

    if (!scrollEl) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStoryId(entry.target.dataset.storyId)
          }
        })
      },
      { root: scrollEl, threshold: 0.6 },
    )

    blockRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node)
      }
    })

    return () => observer.disconnect()
  }, [])

  const activeStoryIndex = storyBlocks.findIndex((block) => block.id === activeStoryId)

  return (
    <section
      className={`view-layer home-view ${transitioning ? 'is-transitioning' : ''}`}
      ref={scrollRef}
    >
      <div className="home-hero">
        <HeroName logo={activeTheme.logo} logoRef={heroLogoRef} />
        <ScrollIndicator hidden={scrolled} />
      </div>

      <div className="home-logo-pin" ref={pinLogoRef} aria-hidden="true">
        <div
          className="home-logo-pin-step"
          style={{ transform: `rotate(${Math.max(0, activeStoryIndex) * 90}deg)` }}
        >
          <img
            className="home-logo-pin-img"
            src={activeTheme.logo}
            alt=""
            ref={pinLogoImgRef}
          />
        </div>
      </div>

      <div className="home-story">
        <div className="home-story-text">
          {storyBlocks.map((block, index) => (
            <p
              className={`home-story-block ${block.id === activeStoryId ? 'is-active' : ''}`}
              key={block.id}
              data-story-id={block.id}
              ref={(node) => {
                blockRefs.current[index] = node
              }}
            >
              {block.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionHeader({
  phase,
  title,
  sectorLabel,
  sectorClassName = 'projects-sector',
  sectorFirst = false,
  extraClassName = '',
}) {
  const sector = <span className={sectorClassName}>{sectorLabel}</span>

  return (
    <header
      className={['projects-list-header', extraClassName, phase === 'out' ? 'is-exiting' : 'is-entering']
        .filter(Boolean)
        .join(' ')}
    >
      {sectorFirst && sector}
      <h1>{title}</h1>
      {!sectorFirst && sector}
      <span className="projects-list-rule" aria-hidden="true" />
    </header>
  )
}

function ContactView({ phase }) {
  const [photoIndex] = useState(pickContactPhotoIndex)

  useEffect(() => {
    lastContactPhotoIndex = photoIndex
  }, [photoIndex])

  const photo = contactPhotos[photoIndex]

  return (
    <section className={`view-layer contact-view page-phase-${phase}`} id="contact">
      <SectionHeader phase={phase} title="CONTACT" sectorLabel="SECTOR 04" />

      <div className="contact-body">
        <div className="contact-intro">
          <h2 className="contact-statement">
            Looking for an <span className="contact-highlight">internship</span> for my third
            year.
          </h2>
          <p className="contact-lead">{contactIntro.text}</p>
        </div>

        <img className="contact-photo" src={photo} alt="" />
      </div>

      <div className="contact-channels">
        {contactChannels.map((channel) =>
          channel.options ? (
            <div className="contact-channel contact-channel-cv" key={channel.label}>
              <div className="contact-channel-default">
                <span className="contact-channel-label">{channel.label}</span>
                <span className="contact-channel-value">{channel.value}</span>
              </div>

              <div className="contact-channel-options">
                {channel.options.map((option) => (
                  <a
                    className="contact-channel-option"
                    href={option.href}
                    download={option.filename}
                    key={option.label}
                  >
                    {option.label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a
              className="contact-channel"
              href={channel.href}
              key={channel.label}
              {...(channel.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="contact-channel-label">{channel.label}</span>
              <span className="contact-channel-value">{channel.value}</span>
            </a>
          ),
        )}
      </div>
    </section>
  )
}

function AboutView({ phase }) {
  return (
    <section className={`view-layer about-view page-phase-${phase}`} id="about">
      <SectionHeader
        phase={phase}
        title="ABOUT"
        sectorLabel="sec-02"
        sectorClassName="about-sector"
        sectorFirst
        extraClassName="about-list-header"
      />

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
          {project.image ? (
            <figure className="project-detail-shot">
              <img src={project.image} alt={`${project.title} interface`} />
            </figure>
          ) : null}

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
      <SectionHeader phase={phase} title="PROJECTS" sectorLabel="SECTOR 03" />

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

function getViewFromHash() {
  const hash = window.location.hash.replace('#', '')
  return pages.includes(hash) ? hash : 'home'
}

function App() {
  const [activeThemeName, setActiveThemeName] = useState(themes[1].name)
  const [view, setView] = useState(getViewFromHash)
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
    (page, { pushHistory = true } = {}) => {
      if (!pages.includes(page)) {
        return
      }

      if (page === view) {
        return
      }

      if (pushHistory) {
        const url = page === 'home' ? window.location.pathname + window.location.search : `#${page}`
        window.history.pushState(null, '', url)
      }

      setTransitionPhase('out')

      window.setTimeout(() => {
        setView(page)
        setTransitionPhase(page === 'home' ? 'idle' : 'in')
      }, NAV_OUT_DURATION)

      window.setTimeout(() => {
        setTransitionPhase('idle')
      }, NAV_SETTLE_DURATION)
    },
    [view],
  )

  useEffect(() => {
    const handlePopState = () => {
      handleNavigate(getViewFromHash(), { pushHistory: false })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [handleNavigate])

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
