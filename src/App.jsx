import { memo, useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import AboutLinks from './AboutLinks'
import GardenName from './GardenName'
import yaetypeShot from './assets/yaetypeSS.webp'
import melographShot from './assets/Melograph.webp'
import melostudioShot from './assets/melostudio.webp'
import ariaShot from './assets/Aria.webp'
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

const pages = ['home', 'about', 'projects', 'contact']
const NAV_OUT_DURATION = 420
const NAV_SETTLE_DURATION = 900
const HOME_SCROLL_SPEED = 0.85
const HOME_SCROLL_EASE = 0.085
const HOME_FOOTER_BLOOM_AT = 0.3
const homeStatement = ['INTERFACES', 'THAT MOVE', 'WITH INTENT']
const homeEthos =
  'Mostly the unglamorous parts — how a layout holds at every width, what moves and what stays put, and why one page feels calculated while the next feels thrown together. Four projects above: two with a team, two on my own.'
const homeAvailability = 'Available from February'

const aboutProfile = {
  name: 'JORGE SIMOES',
  role: 'Software Developer',
  text:
    'I am 18, born in Portugal and currently living in the Netherlands for school and work. Right now everything I do points at front-end development, and I plan on becoming a pro in that field, so most of my time goes into learning how interfaces are structured, how they move, and why some of them feel better than others. Outside of that you will find me bouldering or taking photos.',
}
const aboutFacts = [
  ['STACK', 'React · Next.js · TypeScript · Solid.js'],
  ['SCHOOL', 'Grafisch Lyceum Rotterdam'],
  ['LANGUAGES', 'Portuguese · English · Dutch'],
]
const aboutNow = [
  'Third year at Grafisch Lyceum Rotterdam',
  'Interning until February',
  'Moving from front-end into some backend',
  'Bouldering twice a week',
]
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
const homeWork = projects.map((project) => ({
  title: project.title,
  summary: project.summary,
  stack: project.language,
  status: (project.meta.find(([key]) => key === 'STATUS')?.[1] ?? '').split(' / ')[0],
  href: project.href,
  image: project.image,
}))

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

      {/* inert, not aria-hidden: clicking a link closes the menu while that
          link still holds focus, and aria-hidden over a focused element is
          invalid. inert drops focus along with the accessibility exposure. */}
      <div className="menu-content" inert={!open}>
        <PageList onNavigate={handleNavigate} />
        <LedBar />
        <ThemeSelector activeThemeName={activeThemeName} onThemeSelect={onThemeSelect} />
      </div>
    </nav>
  )
}

function HeroName({ logo }) {
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

const HomeStatement = memo(function HomeStatement({ lines }) {
  return (
    <h2 className="home-statement">
      {lines.map((line) => (
        <span className="home-statement-line" data-reveal="" key={line}>
          <span>{line}</span>
        </span>
      ))}
    </h2>
  )
})

const HomeWorkIndex = memo(function HomeWorkIndex({ onNavigate }) {
  return (
    <div className="home-work-list">
      {homeWork.map((entry) => (
        <article className="home-work-item" data-reveal="" key={entry.title}>
          <div className="home-work-text">
            <h3 className="home-work-title">
              {/* Stretched link: the whole block opens the write-up, while the
                  live link below stays clickable on its own. */}
              <a
                className="home-work-open"
                href="#projects"
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate('projects')
                }}
              >
                {entry.title}
              </a>
            </h3>

            <p className="home-work-summary">{entry.summary}</p>

            <div className="home-work-meta">
              <span className="home-work-stack">{entry.stack}</span>
              <a
                className="home-work-live"
                href={entry.href}
                target="_blank"
                rel="noreferrer"
              >
                {entry.status === 'LIVE' ? 'VISIT' : 'SOURCE'}
                <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>

          <div className="home-work-shot">
            <img src={entry.image} alt="" loading="lazy" decoding="async" />
          </div>
        </article>
      ))}
    </div>
  )
})

function HomeFooter({ activeTheme, layerRef, onBackToTop, revealed }) {
  return (
    <div className={`home-underlayer ${revealed ? 'is-revealed' : ''}`} ref={layerRef}>
      <footer className="home-footer">
        <div className="home-footer-name">
          <GardenName text="JORGE SIMOES" color={activeTheme.color} active={revealed} />
        </div>

        <div className="home-footer-base">
          <div className="home-footer-links">
            <a className="home-footer-link" href={`mailto:${links.email}`}>
              {links.email}
            </a>
            <a
              className="home-footer-link"
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN
            </a>
            <a
              className="home-footer-link"
              href={links.github}
              target="_blank"
              rel="noreferrer"
            >
              GITHUB
            </a>
            <a className="home-footer-link" href={cvHref} download="Jorge Simoes CV.pdf">
              CV
            </a>
          </div>

          <button className="home-footer-top" onClick={onBackToTop} type="button">
            <span className="home-footer-top-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            BACK TO TOP
          </button>
        </div>
      </footer>
    </div>
  )
}

function HomeView({ activeTheme, onNavigate, transitioning }) {
  const scrollRef = useRef()
  const underlayerRef = useRef()
  const [scrolled, setScrolled] = useState(false)
  const [footerRevealed, setFooterRevealed] = useState(false)

  // Tracks how far the scrolling skin has lifted off the footer underneath.
  useEffect(() => {
    const scrollEl = scrollRef.current

    if (!scrollEl) {
      return undefined
    }

    let frame

    const applyScrollProgress = () => {
      const scrollTop = scrollEl.scrollTop
      const revealRange = underlayerRef.current?.offsetHeight || scrollEl.clientHeight
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight
      const reveal =
        revealRange > 0
          ? Math.min(1, Math.max(0, (scrollTop - (maxScroll - revealRange)) / revealRange))
          : 0

      if (scrollTop > 24) {
        setScrolled(true)
      }

      setFooterRevealed(reveal > HOME_FOOTER_BLOOM_AT)
    }

    const handleScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(applyScrollProgress)
    }

    applyScrollProgress()

    scrollEl.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', applyScrollProgress)

    return () => {
      window.cancelAnimationFrame(frame)
      scrollEl.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', applyScrollProgress)
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

  // One-shot reveal for the ruled lines, index rows and display type.
  useEffect(() => {
    const scrollEl = scrollRef.current

    if (!scrollEl) {
      return undefined
    }

    const nodes = Array.from(scrollEl.querySelectorAll('[data-reveal]'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('is-in'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { root: scrollEl, rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  const handleBackToTop = useCallback(() => {
    const scrollEl = scrollRef.current

    if (!scrollEl) {
      return
    }

    scrollEl.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }, [])

  return (
    <section
      className={`view-layer home-view ${transitioning ? 'is-transitioning' : ''}`}
      ref={scrollRef}
    >
      <div className="home-skin">
        <div className="home-hero">
          <HeroName logo={activeTheme.logo} />

          <div className="home-hero-meta" aria-hidden="true">
            <span className="home-hero-meta-item is-bottom-left">FRONT-END DEVELOPER</span>
            <span className="home-hero-meta-item is-bottom-right">ROTTERDAM / NL</span>
          </div>

          <ScrollIndicator hidden={scrolled} />
        </div>

        <section className="home-chapter home-work">
          <p className="home-work-label" data-reveal="">
            Selected work
          </p>
          <HomeWorkIndex onNavigate={onNavigate} />
        </section>

        <section className="home-chapter home-position">
          <HomeStatement lines={homeStatement} />

          <div className="home-ethos" data-reveal="">
            <span className="home-ethos-label">HOW</span>
            <p className="home-ethos-text">{homeEthos}</p>
          </div>
        </section>

        <section className="home-chapter home-ask">
          <p className="home-ask-label" data-reveal="">
            {homeAvailability}
          </p>

          <a className="home-ask-mail" href={`mailto:${links.email}`} data-reveal="">
            <span className="home-ask-mail-value">{links.email}</span>
            <span className="home-ask-mail-arrow" aria-hidden="true">
              &#8594;
            </span>
          </a>
        </section>
      </div>

      <HomeFooter
        activeTheme={activeTheme}
        layerRef={underlayerRef}
        onBackToTop={handleBackToTop}
        revealed={footerRevealed}
      />
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
            Available from <span className="contact-highlight">February</span> for front-end
            work.
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
        </div>

        <p className="about-lead">{aboutProfile.text}</p>

        <aside className="about-aside">
          <dl className="about-facts">
            {aboutFacts.map(([label, value]) => (
              <div className="about-fact" key={label}>
                <dt className="about-fact-label">{label}</dt>
                <dd className="about-fact-value">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="about-now">
            <span className="about-now-label">Now</span>
            <ul className="about-now-list">
              {aboutNow.map((item) => (
                <li className="about-now-item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="about-foot">
          <AboutLinks />
          <span className="about-foot-note">Rotterdam, NL</span>
        </div>
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
        <HomeView
          activeTheme={activeTheme}
          onNavigate={handleNavigate}
          transitioning={transitionPhase === 'out'}
        />
      )}
    </main>
  )
}

export default App
