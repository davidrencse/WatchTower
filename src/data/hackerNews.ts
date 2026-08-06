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
  const url = item.url || discussionUrl;

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

  const results = await Promise.allSettled(
    candidateIds.map(async (id) => {
      const response = await fetch(`${HN_API_ROOT}/item/${id}.json`, { signal });
      if (!response.ok) return null;
      return normalizeStory((await response.json()) as HackerNewsApiItem);
    }),
  );

  const stories = results
    .filter(
      (result): result is PromiseFulfilledResult<HackerNewsStory | null> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value)
    .filter((story): story is HackerNewsStory => story !== null)
    .slice(0, limit);

  if (stories.length === 0) {
    throw new Error('No Hacker News stories are available');
  }

  return stories;
}
