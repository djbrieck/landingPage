import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'add-link',
  templateUrl: './add-link.component.html',
  styleUrl: './add-link.component.scss',
  standalone: true,
  imports: [FormsModule]
})
export class AddLinkComponent {
  title = '';
  url = '';
  @Output() added = new EventEmitter<void>();

  constructor(public bookmarksService: BookmarksService) {}

  add() {
    if (!this.title || !this.url) return;
    this.bookmarksService.addBookmark({
      id: crypto.randomUUID(),
      title: this.title,
      url: this.url,
      clickCount: 0
    });
    this.title = '';
    this.url = '';
    this.added.emit();
  }
}
