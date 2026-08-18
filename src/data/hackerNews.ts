import { safeExternalUrl } from '../lib/safeUrl';

const HN_API_ROOT = 'https://hacker-news.firebaseio.com/v0';
const HN_WEB_ROOT = 'https://news.ycombinator.com';

type HackerNewsApiItem = {
  id?: number;
  by?: string;
  descendants?: number;
  score?: number;
  time?: number;
  title?: string;
  type?: string;
  url?: string;
  deleted?: boolean;
  dead?: boolean;
};

export type HackerNewsStory = {
  id: number;
  author: string;
  commentCount: number;
  score: number;
  publishedAt: number;
  title: string;
  url: string;
  discussionUrl: string;
  source: string;
};

function getStorySource(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'news.ycombinator.com';
  }
}

function normalizeStory(item: HackerNewsApiItem): HackerNewsStory | null {
  if (
    item.type !== 'story' ||
    item.deleted ||
    item.dead ||
    typeof item.id !== 'number' ||
    !item.title
  ) {
    return null;
  }

  const discussionUrl = `${HN_WEB_ROOT}/item?id=${item.id}`;
  // `item.url` is whatever the submitter typed. Fall back to the HN thread rather than
  // rendering an unvetted scheme into an href.
  const url = safeExternalUrl(item.url) ?? discussionUrl;

  return {
    id: item.id,
    author: item.by || 'unknown',
    commentCount: item.descendants || 0,
    score: item.score || 0,
    publishedAt: (item.time || 0) * 1000,
    title: item.title,
    url,
    discussionUrl,
    source: getStorySource(url),
  };
}

export async function fetchHackerNewsTopStories(
  signal: AbortSignal,
  limit = 12,
): Promise<HackerNewsStory[]> {
  const idsResponse = await fetch(`${HN_API_ROOT}/topstories.json`, { signal });
  if (!idsResponse.ok) {
    throw new Error(`Hacker News returned ${idsResponse.status}`);
  }

  const ids = (await idsResponse.json()) as unknown;
  if (!Array.isArray(ids)) {
    throw new Error('Hacker News returned an invalid story list');
  }

  const candidateIds = ids
    .filter((id): id is number => typeof id === 'number')
    .slice(0, Math.max(limit * 2, limit));

  const stories: HackerNewsStory[] = [];
  let cursor = 0;

  // The old implementation fetched 2Ã— the requested story count up front, then discarded half
  // of the responses. Top stories are normally valid, so load exactly what is needed first and
  // request a small repair batch only when deleted/dead entries leave a gap.
  while (stories.length < limit && cursor < candidateIds.length) {
    const missing = limit - stories.length;
    const batchSize = cursor === 0 ? missing : Math.min(Math.max(missing, 2), 4);
    const batch = candidateIds.slice(cursor, cursor + batchSize);
    cursor += batch.length;

    const results = await Promise.allSettled(
      batch.map(async (id) => {
        const response = await fetch(`${HN_API_ROOT}/item/${id}.json`, { signal });
        if (!response.ok) return null;
        return normalizeStory((await response.json()) as HackerNewsApiItem);
      }),
    );
    signal.throwIfAborted();

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) stories.push(result.value);
      if (stories.length === limit) break;
    }
  }

  if (stories.length === 0) {
    throw new Error('No Hacker News stories are available');
  }

  return stories;
}
