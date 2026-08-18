import {
  ArrowRight,
  Crosshair,
  ScanLine,
} from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import d3Logo from "simple-icons/icons/d3.svg";
import eslintLogo from "simple-icons/icons/eslint.svg";
import lucideLogo from "simple-icons/icons/lucide.svg";
import npmLogo from "simple-icons/icons/npm.svg";
import postcssLogo from "simple-icons/icons/postcss.svg";
import radixLogo from "simple-icons/icons/radixui.svg";
import reactLogo from "simple-icons/icons/react.svg";
import tailwindLogo from "simple-icons/icons/tailwindcss.svg";
import typescriptLogo from "simple-icons/icons/typescript.svg";
import vercelLogo from "simple-icons/icons/vercel.svg";
import viteLogo from "simple-icons/icons/vite.svg";
import { LEGAL_LINKS } from "../data/legalLinks";
import "./HomeHero.css";

type HomeHeroProps = {
  onExplore: () => void;
  onPrefetchAtlas?: () => void;
  /** Open a legal page (`/privacy`, `/eula`) in-app rather than reloading the document. */
  onOpenLegal?: (path: string) => void;
};

const intelligenceAreas = [
  "Demographics",
  "Economy",
  "Government",
  "Health",
  "Crime",
  "Migration",
];

type Technology = {
  name: string;
  role: string;
  logo: string | null;
};

const technologies: Technology[] = [
  { name: "React", role: "UI", logo: reactLogo },
  { name: "TypeScript", role: "Type safety", logo: typescriptLogo },
  { name: "Vite", role: "Build", logo: viteLogo },
  { name: "Tailwind CSS", role: "Styles", logo: tailwindLogo },
  { name: "Recharts", role: "Charts", logo: null },
  { name: "D3.js", role: "Data visualization", logo: d3Logo },
  { name: "Radix UI", role: "UI primitives", logo: radixLogo },
  { name: "Lucide", role: "Icons", logo: lucideLogo },
  { name: "PostCSS", role: "CSS tooling", logo: postcssLogo },
  { name: "ESLint", role: "Linting", logo: eslintLogo },
  { name: "npm", role: "Packages", logo: npmLogo },
  { name: "Vercel", role: "Hosting", logo: vercelLogo },
];

function TechnologyLogo({ technology }: { technology: Technology }) {
  if (technology.logo) {
    return <img src={technology.logo} alt="" loading="lazy" decoding="async" />;
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path d="M7 36V13h34" />
      <path d="m10 31 8-9 7 5 12-14" />
      <circle cx="18" cy="22" r="2.2" />
      <circle cx="25" cy="27" r="2.2" />
      <circle cx="37" cy="13" r="2.2" />
    </svg>
  );
}

function TechnologyRail({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className={`wt-tech__set${duplicate ? " wt-tech__set--copy" : ""}`}
      role={duplicate ? undefined : "list"}
      aria-hidden={duplicate || undefined}
    >
      {technologies.map((technology) => (
        <article
          key={`${duplicate ? "copy-" : ""}${technology.name}`}
          className="wt-tech__item"
          role={duplicate ? undefined : "listitem"}
        >
          <span className="wt-tech__logo" aria-hidden>
            <TechnologyLogo technology={technology} />
          </span>
          <span className="wt-tech__identity">
            <strong>{technology.name}</strong>
            <small>{technology.role}</small>
          </span>
        </article>
      ))}
    </div>
  );
}

function TechStackCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const isIntersecting = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const syncVisibility = () => {
      setIsVisible(isIntersecting.current && !document.hidden);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.current = entry.isIntersecting;
        syncVisibility();
      },
      { threshold: 0.12 },
    );
    observer.observe(section);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="technology-stack"
      className="wt-tech"
      aria-label="Technology stack"
    >
      <div className="wt-tech__meta">
        <span>Tech stack</span>
        <span>{technologies.length} modules</span>
      </div>
      <div
        className="wt-tech__viewport"
        data-running={isVisible ? "true" : "false"}
        tabIndex={0}
        aria-label="Project technology stack. Focus or hover to pause."
        aria-roledescription="carousel"
      >
        <div className="wt-tech__track">
          <TechnologyRail />
          <TechnologyRail duplicate />
        </div>
      </div>
    </section>
  );
}

export function HomeHero({ onExplore, onPrefetchAtlas, onOpenLegal }: HomeHeroProps) {
  const handleLegalClick = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    // Modified clicks and middle-click keep their native open-in-new-tab behaviour;
    // a plain left-click routes in-app.
    if (!onOpenLegal) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;
    event.preventDefault();
    onOpenLegal(path);
  };

  return (
    <main className="wt-home">
      <div className="wt-home__landing">
        <div className="wt-home__map" aria-hidden>
          <div className="wt-home__map-image" />
          <div className="wt-home__map-shade" />
          <div className="wt-home__map-grid" />

          <div className="wt-home__map-axis wt-home__map-axis--vertical">
            <span>N 70</span>
            <span>N 30</span>
          </div>
          <div className="wt-home__map-axis wt-home__map-axis--horizontal">
            <span>W 12</span>
            <span>E 42</span>
          </div>

          <span className="wt-home__target wt-home__target--one" />
          <span className="wt-home__target wt-home__target--two" />
          <span className="wt-home__target wt-home__target--three" />
          <span className="wt-home__target wt-home__target--four" />
        </div>

        <div className="wt-home__frame" aria-hidden>
          <span className="wt-home__corner wt-home__corner--tl" />
          <span className="wt-home__corner wt-home__corner--tr" />
          <span className="wt-home__corner wt-home__corner--bl" />
          <span className="wt-home__corner wt-home__corner--br" />
        </div>

        <header className="wt-home__header">
          <a
            className="wt-home__brand"
            href="/"
            aria-label="Project WatchTower home"
          >
            <Crosshair aria-hidden />
            <span>
              <strong>Project WatchTower</strong>
              <small>Country data atlas</small>
            </span>
          </a>

          <div className="wt-home__status" aria-label="System status">
            <span className="wt-home__status-dot" />
            <span>Online</span>
          </div>
        </header>

        <section
          className="wt-home__briefing"
          aria-labelledby="watchtower-title"
        >
          <div className="wt-home__eyebrow">
            <ScanLine aria-hidden />
            <span>Western-first-world country intelligence</span>
          </div>

          <h1 id="watchtower-title" className="wt-home__title">
            <span>Global</span>
            <span>Reconnaissance</span>
          </h1>

          <p className="wt-home__summary">
            Country data on demographics, economics, government, health, crime,
            and migration. Updated as sources change.
          </p>

          <div className="wt-home__actions">
            <button
              type="button"
              className="wt-home__enter"
              onClick={onExplore}
              onPointerEnter={onPrefetchAtlas}
              onFocus={onPrefetchAtlas}
              onTouchStart={onPrefetchAtlas}
            >
              <span>Open atlas</span>
              <ArrowRight aria-hidden />
            </button>

            <nav className="wt-home__legal-actions" aria-label="Legal documents">
              {LEGAL_LINKS.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.path}
                  onClick={(event) => handleLegalClick(event, doc.path)}
                >
                  <span>{doc.id === "privacy" ? "Privacy policy" : "EULA / terms"}</span>
                  <ArrowRight aria-hidden />
                </a>
              ))}
            </nav>
          </div>
        </section>

        <footer className="wt-home__footer" aria-label="Site footer">
          <span className="wt-home__footer-label">Data categories</span>
          <ul>
            {intelligenceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <nav className="wt-home__footer-legal" aria-label="Legal">
            {LEGAL_LINKS.map((doc) => (
              <a
                key={doc.id}
                href={doc.path}
                onClick={(event) => handleLegalClick(event, doc.path)}
              >
                {doc.id === "privacy" ? "Privacy policy" : "EULA / terms"}
              </a>
            ))}
          </nav>
        </footer>

        <TechStackCarousel />
      </div>
    </main>
  );
}
