export type ExtractedMetadata = {
  title: string | null;
  ogImage: string | null;
};

export type HttpResponse = {
  data: string;
  request?: {
    res?: {
      responseUrl?: string;
    };
  };
};
