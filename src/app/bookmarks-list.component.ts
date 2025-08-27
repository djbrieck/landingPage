import { Component, Input, signal } from '@angular/core';

// ...existing code...
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './models';

@Component({
  selector: 'bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styleUrl: './bookmarks-list.component.scss',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class BookmarksListComponent {
  focusedIndex = signal<number>(-1);
  // ...existing code...
  constructor(public bookmarksService: BookmarksService) {}

  onBookmarkKeydown(event: KeyboardEvent, i: number) {
  const bookmarks = this.sortedBookmarks;
  let idx = this.focusedIndex();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      let nextIdx = 0;
      if (idx !== -1) {
        nextIdx = idx < bookmarks.length - 1 ? idx + 1 : 0;
      }
      this.focusedIndex.set(nextIdx);
      setTimeout(() => {
        const el = document.getElementById('bookmark-item-' + bookmarks[nextIdx].id);
        if (el) el.focus();
      }, 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      let prevIdx;
      if (idx === -1) {
        prevIdx = bookmarks.length - 1;
      } else {
        prevIdx = idx > 0 ? idx - 1 : bookmarks.length - 1;
      }
      this.focusedIndex.set(prevIdx);
      setTimeout(() => {
        const el = document.getElementById('bookmark-item-' + bookmarks[prevIdx].id);
        if (el) el.focus();
      }, 0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (idx >= 0 && idx < bookmarks.length) {
        this.onLinkClick(bookmarks[idx]);
      }
    }
  }

  onNavigateResults(direction: 'up' | 'down') {
    const bookmarks = this.filter ? this.sortedBookmarks : this.bookmarksService.bookmarks();
    if (!bookmarks.length) return;
    let idx = this.focusedIndex();
    // Clamp index to valid range
    if (idx < 0 || idx >= bookmarks.length) idx = -1;
    if (direction === 'down') {
      idx = idx < bookmarks.length - 1 ? idx + 1 : 0;
    } else {
      idx = idx > 0 ? idx - 1 : bookmarks.length - 1;
    }
    this.focusedIndex.set(idx);
    setTimeout(() => {
      if (idx >= 0 && idx < bookmarks.length) {
        const el = document.getElementById('bookmark-item-' + bookmarks[idx].id);
        if (el) el.focus();
      }
    }, 0);
  }

  onResultKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const idx = this.focusedIndex();
      const bookmarks = this.filter ? this.sortedBookmarks : this.bookmarksService.bookmarks();
      if (idx >= 0 && idx < bookmarks.length) {
        this.onLinkClick(bookmarks[idx]);
      }
    }
  }

  // ...existing code...
  private _filter = '';
  @Input() set filter(val: string) {
    this._filter = val;
    localStorage.setItem('bookmarkFilter', val);
    this.focusedIndex.set(-1);
  }
  get filter() {
    return this._filter;
  }

  ngOnInit() {
    const savedFilter = localStorage.getItem('bookmarkFilter');
    if (savedFilter !== null) {
      this._filter = savedFilter;
    }
  }
  dropdownOpen = signal<string | null>(null);
  editingBookmark = signal<Bookmark | null>(null);
  editTitle = signal('');
  editUrl = signal('');
  editErrors = signal<{ title?: string; url?: string }>({});

  setEditTitle(value: string) {
    this.editTitle.set(value);
  }

  setEditUrl(value: string) {
    this.editUrl.set(value);
  }

  validateEdit(): boolean {
    const errors: { title?: string; url?: string } = {};
    if (!this.editTitle().trim()) {
      errors.title = 'Title is required.';
    }
    try {
      const url = new URL(this.editUrl());
      if (!url.protocol.startsWith('http')) {
        errors.url = 'URL must start with http or https.';
      }
    } catch {
      errors.url = 'URL is invalid.';
    }
    this.editErrors.set(errors);
    return Object.keys(errors).length === 0;
  }


  get sortedBookmarks(): Bookmark[] {
    return this.bookmarksService.bookmarks()
      .filter(b => b.title.toLowerCase().includes(this.filter.toLowerCase()) || b.url.toLowerCase().includes(this.filter.toLowerCase()))
      .sort((a, b) => b.clickCount - a.clickCount);
  }

  openDropdown(id: string) {
    this.dropdownOpen.set(this.dropdownOpen() === id ? null : id);
  }

  editBookmark(b: Bookmark) {
    this.editingBookmark.set(b);
    this.editTitle.set(b.title);
    this.editUrl.set(b.url);
  }

  saveEdit() {
    if (!this.validateEdit()) return;
    const b = this.editingBookmark();
    if (!b) return;
    this.bookmarksService.updateBookmark({
      ...b,
      title: this.editTitle(),
      url: this.editUrl(),
    });
    this.editingBookmark.set(null);
    this.editErrors.set({});
    this.dropdownOpen.set(null);
  }

  cancelEdit() {
    this.editingBookmark.set(null);
    this.editErrors.set({});
    this.dropdownOpen.set(null);
  }

  deleteBookmark(id: string) {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      this.bookmarksService.deleteBookmark(id);
    }
    this.dropdownOpen.set(null);
  }

  onLinkClick(b: Bookmark) {
    this.bookmarksService.incrementClick(b.id);
    window.open(b.url, '_self');
  }
}
