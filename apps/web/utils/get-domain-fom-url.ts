export const getDomainFromUrl = (url: string) => {
  return new URL(url).hostname.replace(/^www\./, "");
};
