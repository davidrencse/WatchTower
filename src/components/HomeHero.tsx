import { ArrowRight, Crosshair, ScanLine } from 'lucide-react';
import './HomeHero.css';

type HomeHeroProps = {
  onExplore: () => void;
};

const intelligenceAreas = ['Demographics', 'Economy', 'Government', 'Health', 'Crime', 'Migration'];

export function HomeHero({ onExplore }: HomeHeroProps) {
  return (
    <main className="wt-home">
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
        <a className="wt-home__brand" href="/" aria-label="Project WatchTower home">
          <Crosshair aria-hidden />
          <span>
            <strong>Project WatchTower</strong>
            <small>Country intelligence atlas</small>
          </span>
        </a>

        <div className="wt-home__status" aria-label="System status">
          <span className="wt-home__status-dot" />
          <span>Atlas online</span>
          <span className="wt-home__status-code">WT / 01</span>
        </div>
      </header>

      <section className="wt-home__briefing" aria-labelledby="watchtower-title">
        <div className="wt-home__eyebrow">
          <ScanLine aria-hidden />
          <span>Western-first-world country intelligence</span>
        </div>

        <h1 id="watchtower-title" className="wt-home__title">
          <span>Global</span>
          <span>Reconnaissance</span>
        </h1>

        <p className="wt-home__summary">
          WatchTower brings country-level data and statistics into one regularly updated intelligence
          atlas, prioritizing indicators that shape everyday life across the Western first world.
        </p>

        <div className="wt-home__actions">
          <button type="button" className="wt-home__enter" onClick={onExplore}>
            <span>Enter the atlas</span>
            <ArrowRight aria-hidden />
          </button>

          <div className="wt-home__coverage">
            <span className="wt-home__coverage-label">Coverage</span>
            <span className="wt-home__coverage-state">Active development</span>
            <span className="wt-home__coverage-note">
              Incomplete coverage and occasional issues are expected.
            </span>
          </div>
        </div>
      </section>

      <footer className="wt-home__footer" aria-label="Intelligence coverage areas">
        <span className="wt-home__footer-label">Signals monitored</span>
        <ul>
          {intelligenceAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
        <span className="wt-home__coordinates">51.5072° N&nbsp;&nbsp; 0.1276° W</span>
      </footer>
    </main>
  );
}
