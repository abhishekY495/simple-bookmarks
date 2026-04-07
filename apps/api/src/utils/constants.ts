export const BOOKMARK_PARSING_QUEUE_NAME = 'bookmark-parsing';

export type BOOKMARK_PARSE_JOB_TYPE = {
  bookmarkId: string;
  url: string;
};

export const DEFFAULT_JOB_OPTIONS = {
  attempts: 3,
  removeOnComplete: 100,
  removeOnFail: 100,
};

export const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';
export const REQUEST_TIMEOUT = 5000;
export const MAX_REDIRECTS = 3;

// title
export const TITLE_ELEMENTS = ['head > title', 'title'];
export const OG_TITLE_ELEMENTS = [
  "head > meta[property='og:title']",
  "meta[property='og:title']",
];
export const TWITTER_TITLE_ELEMENTS = [
  "head > meta[name='twitter:title']",
  "meta[name='twitter:title']",
];

// og:image
export const OG_IMAGE_ELEMENTS = [
  "head > meta[property='og:image']",
  "meta[property='og:image']",
];
export const TWITTER_IMAGE_ELEMENTS = [
  "head > meta[name='twitter:image']",
  "meta[name='twitter:image']",
];
