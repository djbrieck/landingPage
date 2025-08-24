import { Injectable, signal } from '@angular/core';
import { Bookmark, Settings } from './models';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  bookmarks = signal<Bookmark[]>([]);
  settings = signal<Settings>({
    searchEngine: 'Google',
    favoriteSearchUrl: 'https://www.google.com/search?q=',
  });

  constructor() {
    this.load();
  }

  addBookmark(bookmark: Bookmark) {
    this.bookmarks.update(bks => [bookmark, ...bks]);
    this.save();
  }

  updateBookmark(updated: Bookmark) {
    this.bookmarks.update(bks => bks.map(b => b.id === updated.id ? updated : b));
    this.save();
  }

  deleteBookmark(id: string) {
    this.bookmarks.update(bks => bks.filter(b => b.id !== id));
    this.save();
  }

  incrementClick(id: string) {
    this.bookmarks.update(bks => bks.map(b => b.id === id ? { ...b, clickCount: b.clickCount + 1 } : b));
    this.save();
  }

  setSettings(settings: Settings) {
    this.settings.set(settings);
    this.save();
  }

  save() {
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks()));
    localStorage.setItem('settings', JSON.stringify(this.settings()));
  }

  load() {
    const bks = localStorage.getItem('bookmarks');
    if (bks) this.bookmarks.set(JSON.parse(bks));
    const st = localStorage.getItem('settings');
    if (st) this.settings.set(JSON.parse(st));
  }

  importBookmarks(bookmarks: Bookmark[]) {
    this.bookmarks.set(bookmarks);
    this.save();
  }

  exportBookmarks(): string {
    return JSON.stringify(this.bookmarks(), null, 2);
  }
}
