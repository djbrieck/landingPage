import { Component, Input, signal } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './models';

@Component({
  selector: 'bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styleUrl: './bookmarks-list.component.scss',
  standalone: true,
  imports: []
})
export class BookmarksListComponent {
  @Input() filter = '';
  dropdownOpen = signal<string | null>(null);

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
    // To be implemented
  }

  deleteBookmark(id: string) {
    this.bookmarksService.deleteBookmark(id);
  }

  onLinkClick(b: Bookmark) {
    this.bookmarksService.incrementClick(b.id);
    window.open(b.url, '_self');
  }
}
