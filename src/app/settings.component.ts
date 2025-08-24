import { Component } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'settings-page',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
  imports: [FormsModule]
})
export class SettingsComponent {
  searchEngine = '';
  favoriteSearchUrl = '';
  importJson = '';
  importHtml = '';

  constructor(public bookmarksService: BookmarksService) {
    this.searchEngine = bookmarksService.settings().searchEngine;
    this.favoriteSearchUrl = bookmarksService.settings().favoriteSearchUrl;
  }

  saveSettings() {
    this.bookmarksService.setSettings({
      searchEngine: this.searchEngine,
      favoriteSearchUrl: this.favoriteSearchUrl
    });
  }

  exportJson() {
    const data = this.bookmarksService.exportBookmarks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookmarks.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromJson(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const bookmarks = JSON.parse(e.target.result);
        this.bookmarksService.importBookmarks(bookmarks);
      } catch {}
    };
    reader.readAsText(file);
  }

  importFromHtml(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const html = e.target.result as string;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = Array.from(doc.querySelectorAll('a')).map(a => ({
        id: crypto.randomUUID(),
        title: a.textContent || a.href,
        url: a.href,
        clickCount: 0
      }));
      this.bookmarksService.importBookmarks(links);
    };
    reader.readAsText(file);
  }
}
