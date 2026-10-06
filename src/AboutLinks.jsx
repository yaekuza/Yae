import { cvHref, links } from './links'

const icons = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin:
    "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.02h4.56V24H.22zM8.34 8.02h4.37v2.18h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V24h-4.56v-7.28c0-1.74-.03-3.98-2.42-3.98-2.43 0-2.8 1.9-2.8 3.86V24H8.34z",
  cv:
    "M4 1h9l7 7v15H4zM13 1l7 7h-7zM7.5 12.5h9v1.6h-9zM7.5 15.8h9v1.6h-9zM7.5 19.1h6v1.6h-6z",
}

const aboutLinks = [
  { name: "GitHub", href: links.github, icon: icons.github },
  { name: "LinkedIn", href: links.linkedin, icon: icons.linkedin },
]

function AboutLinks() {
  return (
    <div className="about-links">
      {aboutLinks.map((link) => (
        <a
          className="about-link"
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.name}
          key={link.name}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={link.icon} />
          </svg>
        </a>
      ))}

      <a className="about-link" href={cvHref} download="Jorge Simoes CV.pdf" aria-label="Download CV">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d={icons.cv} />
        </svg>
      </a>
    </div>
  )
}

export default AboutLinks
