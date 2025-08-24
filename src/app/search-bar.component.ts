import { Component, Output, EventEmitter } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  standalone: true,
  imports: [FormsModule]
})
export class SearchBarComponent {
  query = '';
  @Output() search = new EventEmitter<string>();

  constructor(public bookmarksService: BookmarksService) {}

  onInput() {
    this.search.emit(this.query);
  }

  onEnter() {
    if (!this.bookmarksService.bookmarks().some(b => b.title.toLowerCase().includes(this.query.toLowerCase()) || b.url.toLowerCase().includes(this.query.toLowerCase()))) {
      window.open(this.bookmarksService.settings().favoriteSearchUrl + encodeURIComponent(this.query), '_blank');
    }
  }
}
