export interface Bookmark {
  id: string;
  title: string;
  url: string;
  clickCount: number;
}

export interface Settings {
  searchEngine: string;
  favoriteSearchUrl: string;
}
