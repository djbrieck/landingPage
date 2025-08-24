
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar.component';
import { AddLinkComponent } from './add-link.component';
import { BookmarksListComponent } from './bookmarks-list.component';
import { SettingsComponent } from './settings.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    SearchBarComponent,
    AddLinkComponent,
    BookmarksListComponent,
    SettingsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  filter = '';
  showAdd = false;
  showSettings = false;
  protected readonly title = signal('bookmarks-sorter');
}
