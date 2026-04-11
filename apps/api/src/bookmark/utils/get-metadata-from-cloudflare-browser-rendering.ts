import Cloudflare from 'cloudflare';
import {
  OG_IMAGE_ELEMENTS,
  OG_TITLE_ELEMENTS,
  TITLE_ELEMENTS,
  TWITTER_IMAGE_ELEMENTS,
  TWITTER_TITLE_ELEMENTS,
  USER_AGENT,
} from 'src/utils/constants';
import { ExtractedMetadata } from './types';
import { parseScrapes } from './parse-scrapes';

export const getMetadataFromCloudflareBrowserRendering = async (
  url: string,
): Promise<ExtractedMetadata> => {
  const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
    throw new Error('CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID is not set');
  }

  try {
    const client = new Cloudflare({
      apiToken: CLOUDFLARE_API_TOKEN,
    });

    const selectors = [
      ...TITLE_ELEMENTS,
      ...OG_TITLE_ELEMENTS,
      ...TWITTER_TITLE_ELEMENTS,
      ...OG_IMAGE_ELEMENTS,
      ...TWITTER_IMAGE_ELEMENTS,
    ];

    const elements = selectors.map((selector) => ({
      selector,
    }));

    const scrapes = await client.browserRendering.scrape.create({
      account_id: CLOUDFLARE_ACCOUNT_ID,
      url,
      elements,
      userAgent: USER_AGENT,
      gotoOptions: {
        waitUntil: 'networkidle2',
      },
    });

    const { title, ogImage } = parseScrapes(scrapes);

    return {
      title,
      ogImage,
    };
  } catch (error) {
    console.error(error);
    return {
      title: null,
      ogImage: null,
    };
  }
};
