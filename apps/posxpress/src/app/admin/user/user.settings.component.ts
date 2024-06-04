import { SelectionModel } from '@angular/cdk/collections';
import {
  Component
} from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';
import { ICreateUser, IUser } from '@px/interface';
import { DataService } from '../../data/data.service';
import { AdminSettings } from '../settings';
import { UserSettingsService } from './user.settings.service';
import { CrudDialogService } from '@px/client-crud';
import { UserSettingsDialogComponent } from './user.edit.dialog';

@Component({
  selector: 'px-user.settings',
  templateUrl: './user.settings.component.html',
  styleUrls: ['./user.settings.component.scss'],
  providers: [
    {
      provide: CrudDialogService,
      deps: [MatDialog, UserSettingsService],
      useFactory: (matDialog: MatDialog, userSettingsService: UserSettingsService) =>
        new CrudDialogService<IUser, UserSettingsDialogComponent>(
          matDialog,
          UserSettingsDialogComponent,
          userSettingsService
        ),
    },
  ]
})
export class UserSettingsComponent extends AdminSettings {
  title = 'Benutzer';
  displayedColumns: string[] = [
    'select',
    'name',
    'password',
    'tags',
    'actions',
  ];
  dataSource: IUser[] = [];
  selection = new SelectionModel<IUser>(true, []);
  selected: IUser[] = [];

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    private userSettingsService: UserSettingsService,
    private crudDialogService: CrudDialogService<
    IUser,
    UserSettingsDialogComponent
  >
  ) {
    super();
    this.updateDataSource();
    this.selection.changed.subscribe((value) => {
      this.selected = value.source.selected;
      console.log(value.source.selected);
    });
  }

  updateDataSource() {
    this.userSettingsService
      .index()
      .subscribe((value) => (this.dataSource = value));
  }

  openDialog(data: ICreateUser, edit: false): void;
  openDialog(data: IUser, edit?: true): void;
  openDialog(data: IUser, edit = true): void {
    this.crudDialogService.openCrudDialog({ data, edit })
    .subscribe(() => this.updateDataSource())
  }

  createUser() {
    // TODO solve how to do with _id
    this.openDialog(
      { name: '', hashedPassword: '', password: '', roles: [], tags: [] },
      false
    );
  }

  deleteUser() {
    this.selected.forEach((user: IUser) => {
      this.userSettingsService.delete(user._id).subscribe();
      this.dataSource = [
        ...this.dataSource.filter((dataValue) => user._id !== dataValue._id),
      ]; // TODO Update List except editing
    });
    this.selection.clear();
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
