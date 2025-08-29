import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksService } from './bookmarks.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class SearchBarComponent {
  clearSearch() {
    this.query = '';
    localStorage.setItem('bookmarkFilter', '');
    this.search.emit(this.query);
  }
  query = '';
  @Output() search = new EventEmitter<string>();
  @Output() navigateResults = new EventEmitter<'up' | 'down'>();
  onSearchKeydown(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateResults.emit('down');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateResults.emit('up');
    }
  }

  constructor(public bookmarksService: BookmarksService) {}

  onInput() {
    localStorage.setItem('bookmarkFilter', this.query);
    this.search.emit(this.query);
  }
  ngOnInit() {
    const savedQuery = localStorage.getItem('bookmarkFilter');
    if (savedQuery !== null) {
      this.query = savedQuery;
      this.search.emit(this.query);
    }
  }

  onEnter() {
    if (!this.bookmarksService.bookmarks().some(b => b.title.toLowerCase().includes(this.query.toLowerCase()) || b.url.toLowerCase().includes(this.query.toLowerCase()))) {
      window.open(this.bookmarksService.settings().favoriteSearchUrl + encodeURIComponent(this.query), '_blank');
    }
  }
}
