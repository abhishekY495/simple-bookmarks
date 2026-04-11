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

// Cloudflare Browser Rendering
export type Attribute = {
  name: string;
  value: string;
};

export type Result = {
  attributes: Attribute[];
  height: number;
  html: string;
  left: number;
  text: string;
  top: number;
  width: number;
};

export type DataItem = {
  results: Result[];
  selector: string;
};

export type Root = {
  data: DataItem[];
};
