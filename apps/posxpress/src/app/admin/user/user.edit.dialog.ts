import { Component, Inject } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
    AbstractCrudDialogComponent,
    CrudDialogComponent,
    CrudOpenContext,
} from '@px/client-crud';
import { FormTagSelectComponent } from '@px/client-forms';
import { IUser } from '@px/interface';
import { DataService } from '../../data/data.service';

export type IUserOpenContext = CrudOpenContext<IUser>;

interface UserControl {
  name: FormControl<string>;
  password: FormControl<string>;
  tags: FormControl<string[]>;
}

@Component({
  selector: 'px-user.settings.dialog',
  templateUrl: 'user.edit.dialog.html',
  standalone: true,
  imports: [
    FormTagSelectComponent,
    CrudDialogComponent,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  providers: [DataService],
})
export class UserSettingsDialogComponent extends AbstractCrudDialogComponent<
  IUserOpenContext,
  UserControl
> {
  ingredientsExpanded = false;

  protected crudForm: FormGroup<UserControl> = this.formBuilder.group({
    name: ['', Validators.required],
    password: [''],
    tags: [new Array<string>()],
  });

  constructor(
    protected dialogRef: MatDialogRef<UserSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) protected context: IUserOpenContext,
    private formBuilder: NonNullableFormBuilder,
    protected dataService: DataService
  ) {
    super();
    const data: IUser = JSON.parse(JSON.stringify(context.data))
    if (context.edit) {
      this.crudForm.patchValue(data);
    }
  }

  public get user() {
    return this.crudForm.value;
  }
}
