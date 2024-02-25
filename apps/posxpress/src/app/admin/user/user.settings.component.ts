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
import { DataService } from '../../data/data.service'
import { ICreateUser, IUser } from '@px/interface';
import { UserSettingsService } from './user.settings.service';

@Component({
  selector: 'org-user.settings',
  templateUrl: './user.settings.component.html',
  styleUrls: ['./user.settings.component.scss'],
})
export class UserSettingsComponent extends AdminSettings {
  title = "Benutzer"
  displayedColumns: string[] = ['select', 'name', 'password', 'tags', 'actions'];
  dataSource: IUser[] = [];
  selection = new SelectionModel<IUser>(true, []);
  selected: IUser[] = []
  
  constructor(public dialog: MatDialog, private data: DataService, private userSettingsService: UserSettingsService) {
    super()
    this.updateDataSource()
    this.selection.changed.subscribe(value => {this.selected = value.source.selected; console.log(value.source.selected)});
  }

  updateDataSource() {
    this.userSettingsService.index().subscribe(value => this.dataSource = value)
  }
  
  openDialog(user: ICreateUser, newlyCreated: true): void
  openDialog(user: IUser, newlyCreated?: false): void
  openDialog(user: IUser | ICreateUser, newlyCreated=false): void {
    const dialogRef = this.dialog.open(UserSettingsDialogComponent, {
      data: {
        user: user,
        new: newlyCreated
      },
    });

    dialogRef.afterClosed().subscribe((result: IUser) => { // TODO: This is also Create
      if (result) {
        const index = this.dataSource.findIndex((value: IUser) => value._id === result._id)
        if (index !== -1) {
          this.userSettingsService.update(result._id, result).subscribe()
        }
        else {
          result.roles = ['waiter']
          this.userSettingsService.create(result).subscribe()
        }
        this.updateDataSource()
      }
    });
  }

  createUser() {
    // TODO solve how to do with _id
    this.openDialog({name: '', hashedPassword: '', password: '', roles: [], tags: []}, true)
  }

  deleteUser() {
    this.selected.forEach((user: IUser) => {
      this.userSettingsService.delete(user._id).subscribe()
      this.dataSource = [...this.dataSource.filter(dataValue => user._id !== dataValue._id)] // TODO Update List except editing
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
  providers: [DataService],
})
export class UserSettingsDialogComponent {
  user: IUser;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  allTags: string[] = [];

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: IUser | ICreateUser; new?: boolean },
    private dataService: DataService
  ) {
    this.dataService.getSettings().subscribe((value) => (this.allTags = value.tags));
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
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

    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }
}