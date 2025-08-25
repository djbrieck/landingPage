import { Component, Input, signal } from '@angular/core';
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
  @Input() filter = '';
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

  constructor(public bookmarksService: BookmarksService) {}

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
