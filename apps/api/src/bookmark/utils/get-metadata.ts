import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  OG_IMAGE_ELEMENTS,
  OG_TITLE_ELEMENTS,
  TITLE_ELEMENTS,
  TWITTER_TITLE_ELEMENTS,
  TWITTER_IMAGE_ELEMENTS,
  USER_AGENT,
  REQUEST_TIMEOUT,
  MAX_REDIRECTS,
} from '../../utils/constants';
import { ExtractedMetadata, HttpResponse } from './types';

const normalizeValue = (value?: string | null) => {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : null;
};

const resolveUrl = (value: string | null, pageUrl: string) => {
  if (!value) {
    return null;
  }
  try {
    return new URL(value, pageUrl).toString();
  } catch {
    return value;
  }
};

export const getMetadata = async (url: string): Promise<ExtractedMetadata> => {
  const response = (await axios.get<string>(url, {
    timeout: REQUEST_TIMEOUT,
    maxRedirects: MAX_REDIRECTS,
    responseType: 'text',
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
    },
  })) as HttpResponse;

  const $ = cheerio.load(response.data);

  let title: string | null = null;
  let ogTitle: string | null = null;
  let ogImage: string | null = null;
  let twitterTitle: string | null = null;
  let twitterImage: string | null = null;

  for (const selector of TITLE_ELEMENTS) {
    const text = normalizeValue($(selector).text());
    if (text) {
      title = text;
      break;
    }
  }

  for (const selector of OG_TITLE_ELEMENTS) {
    const text = normalizeValue($(selector).attr('content'));
    if (text) {
      ogTitle = text;
      break;
    }
  }

  for (const selector of OG_IMAGE_ELEMENTS) {
    const text = normalizeValue($(selector).attr('content'));
    if (text) {
      ogImage = resolveUrl(text, response.request?.res?.responseUrl ?? url);
      break;
    }
  }

  for (const selector of TWITTER_TITLE_ELEMENTS) {
    const text = normalizeValue($(selector).attr('content'));
    if (text) {
      twitterTitle = text;
      break;
    }
  }

  for (const selector of TWITTER_IMAGE_ELEMENTS) {
    const text = normalizeValue($(selector).attr('content'));
    if (text) {
      twitterImage = resolveUrl(
        text,
        response.request?.res?.responseUrl ?? url,
      );
      break;
    }
  }

  return {
    title: ogTitle ?? twitterTitle ?? title,
    ogImage: ogImage ?? twitterImage,
  };
};
