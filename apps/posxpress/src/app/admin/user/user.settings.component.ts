import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { AdminSettings } from '../settings'
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {NgFor, AsyncPipe} from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { User } from 'libs/interface'
import { v4 as uuidv4 } from 'uuid';
import { DataService } from '../../data/data.service'

@Component({
  selector: 'org-user.settings',
  templateUrl: './user.settings.component.html',
  styleUrls: ['./user.settings.component.scss'],
})
export class UserSettingsComponent extends AdminSettings {
  title = "Benutzer"
  displayedColumns: string[] = ['select', 'name', 'password', 'tags', 'actions'];
  dataSource: User[] = [];
  selection = new SelectionModel<User>(true, []);
  selected: User[] = []
  
  constructor(public dialog: MatDialog, private data: DataService) {
    super()
    this.data.getUsers().subscribe(value => this.dataSource = value)
    this.selection.changed.subscribe(value => {this.selected = value.source.selected; console.log(value.source.selected)});
  }
  
  openDialog(user: User, newlyCreated=false) {
    const dialogRef = this.dialog.open(UserSettingsDialogComponent, {
      data: {
        user: user,
        new: newlyCreated
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.findIndex((value: User) => value.id === result.id)
        if (index !== -1) {
          this.dataSource[index] = result
        }
        else {
          this.dataSource.push(result)
        }
        this.dataSource = [...this.dataSource]
      }
    });
  }

  createUser() {
    // TODO solve how to do with id
    this.openDialog({id: uuidv4(), name: '', password: '', tags: []}, true)
  }

  deleteUser() {
    this.selected.forEach(value => {
      this.dataSource = [...this.dataSource.filter(dataValue => value.id !== dataValue.id)]
    })
    this.selection.clear()
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }
}

@Component({
  selector: 'org-user.settings.dialog',
  templateUrl: 'user.edit.dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    NgFor,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class UserSettingsDialogComponent {
  user: User
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  allTags: string[] = ['Essen', 'Trinken']; // TODO ask DB

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User, new?: boolean }) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
    this.user = JSON.parse(JSON.stringify(this.data.user));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.user.tags.push(value);
    }

    // Clear the input value
    event.chipInput?.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.user.tags.indexOf(tag);

    if (index >= 0) {
      this.user.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.user.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
}