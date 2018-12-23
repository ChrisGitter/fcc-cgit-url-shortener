export as namespace Data;

export interface UrlInfo {
  original_url: string;
  short_url: string;
  timestamp: number;
}

export interface DB {
  urls: UrlInfo[];
}
