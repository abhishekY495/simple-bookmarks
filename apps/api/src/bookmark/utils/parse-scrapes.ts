import { DataItem } from './types';

export const parseScrapes = (scrapes: unknown) => {
  const scrapeItems = scrapes as DataItem[];

  // Helpers
  const getMetaContent = (
    data: DataItem[],
    selector: string,
    attrName: string = 'content',
  ): string | null => {
    const item = data.find((d) => d.selector === selector);
    if (!item?.results.length) return null;

    const attr = item.results[0].attributes?.find((a) => a.name === attrName);
    return attr?.value ?? null;
  };

  const getText = (data: DataItem[], selector: string): string | null => {
    const item = data.find((d) => d.selector === selector);
    return item?.results[0]?.text ?? null;
  };

  // Usage
  const ogTitle = getMetaContent(scrapeItems, "meta[property='og:title']");
  const twitterTitle = getMetaContent(
    scrapeItems,
    "meta[name='twitter:title']",
  );
  const pageTitle = getText(scrapeItems, 'title');

  const ogImage = getMetaContent(scrapeItems, "meta[property='og:image']");
  const twitterImage = getMetaContent(
    scrapeItems,
    "meta[name='twitter:image']",
  );

  const title: string | null = ogTitle ?? twitterTitle ?? pageTitle;
  const image: string | null = ogImage ?? twitterImage;

  return { title, ogImage: image };
};
