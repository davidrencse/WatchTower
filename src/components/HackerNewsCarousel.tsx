import {
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchHackerNewsTopStories,
  type HackerNewsStory,
} from '../data/hackerNews';
import './HackerNewsCarousel.css';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

function formatAge(timestamp: number) {
  const elapsedMinutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60_000));
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  return `${Math.floor(elapsedHours / 24)}d ago`;
}

function StorySet({
  stories,
  duplicate = false,
}: {
  stories: HackerNewsStory[];
  duplicate?: boolean;
}) {
  return (
    <div className="wt-hn__set" aria-hidden={duplicate || undefined}>
      {stories.map((story, index) => (
        <article
          key={`${duplicate ? 'duplicate-' : ''}${story.id}`}
          className="wt-hn__story"
          aria-label={duplicate ? undefined : `${index + 1} of ${stories.length}`}
        >
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={duplicate ? -1 : undefined}
          >
            <span className="wt-hn__story-meta">
              <strong>{String(index + 1).padStart(2, '0')}</strong>
              <span>{story.source}</span>
              <span>{formatAge(story.publishedAt)}</span>
            </span>
            <span className="wt-hn__headline">{story.title}</span>
            <ExternalLink aria-hidden />
          </a>
          <a
            className="wt-hn__discussion"
            href={story.discussionUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={duplicate ? -1 : undefined}
            aria-label={duplicate ? undefined : `${story.commentCount} comments on Hacker News`}
          >
            <span>{story.score} pts</span>
            <span>
              <MessageSquare aria-hidden />
              {story.commentCount}
            </span>
          </a>
        </article>
      ))}
    </div>
  );
}

export function HackerNewsCarousel() {
  const requestRef = useRef<AbortController | null>(null);
  const [stories, setStories] = useState<HackerNewsStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const loadStories = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const nextStories = await fetchHackerNewsTopStories(controller.signal);
      setStories(nextStories);
      setUpdatedAt(Date.now());
    } catch (reason) {
      if (controller.signal.aborted) return;
      setError(reason instanceof Error ? reason.message : 'Unable to load Hacker News');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStories();
    const refreshTimer = window.setInterval(() => {
      if (!document.hidden) void loadStories();
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(refreshTimer);
      requestRef.current?.abort();
    };
  }, [loadStories]);

  return (
    <section
      className="wt-hn"
      aria-label={`Hacker News technology stories${updatedAt ? `, updated ${formatAge(updatedAt)}` : ''}`}
    >
      <div className="wt-hn__carousel">
        <div
          className="wt-hn__rail"
          role="region"
          aria-roledescription="carousel"
          aria-label="Continuously scrolling top Hacker News technology stories. Hover or focus to pause."
          aria-busy={loading}
          tabIndex={0}
        >
          {stories.length > 0 ? (
            <div className="wt-hn__track">
              <StorySet stories={stories} />
              <StorySet stories={stories} duplicate />
            </div>
          ) : null}

          {loading && stories.length === 0 ? (
            <div className="wt-hn__state" role="status">
              Acquiring top stories…
            </div>
          ) : null}
          {error && stories.length === 0 ? (
            <div className="wt-hn__state wt-hn__state--error" role="alert">
              <span>Feed unavailable</span>
              <button type="button" onClick={() => void loadStories()}>
                Retry
              </button>
            </div>
          ) : null}
        </div>

      </div>

      <span className="sr-only" aria-live="polite">
        {error && stories.length > 0 ? 'Refresh failed; showing the last loaded stories.' : ''}
      </span>
    </section>
  );
}
