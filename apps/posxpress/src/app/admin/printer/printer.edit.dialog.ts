import { AsyncPipe, NgFor } from '@angular/common';
import {
  Component,
  Inject
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AbstractCrudDialogComponent,
  CrudDialogComponent,
  CrudOpenContext,
} from '@px/client-crud';
import { IPrinter, MODELS } from '@px/interface';
import { Observable, map } from 'rxjs';
import { DataService } from '../../data/data.service';
import { PrintService } from '../../print/print.service';
import { FormTagSelectComponent } from '@px/client-forms';

export type IPrinterOpenContext = CrudOpenContext<IPrinter>

interface printerControl {
  name: FormControl<string>;
  address: FormControl<string>;
  tags: FormControl<string[]>;
  model: FormControl<string>;
}

@Component({
  selector: 'px-printer.settings.dialog',
  templateUrl: 'printer.edit.dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    FormTagSelectComponent,
    MatSnackBarModule,
    MatSelectModule,
    NgFor,
    ReactiveFormsModule,
    AsyncPipe,
    CrudDialogComponent,
  ],
  providers: [DataService, PrintService],
})
export class PrinterSettingsDialogComponent extends AbstractCrudDialogComponent<
  IPrinterOpenContext,
  printerControl
> {
  protected allTags$: Observable<string[]>
  modelGroups = MODELS;

  protected crudForm: FormGroup<printerControl> = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    tags: [new Array<string>],
    model: ['', Validators.required],
  });
  constructor(
    protected dialogRef: MatDialogRef<PrinterSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    protected context: IPrinterOpenContext,
    private formBuilder: NonNullableFormBuilder,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private printService: PrintService
  ) {
    super();
    const {data, edit} = context
    if(edit) {
      this.crudForm.setValue({
        name: data.name,
        address: data.address,
        model: data.model,
        tags: data.tags,
      });
    }

    this.allTags$ = this.dataService
    .getSettings().pipe(
      map(settings => settings.tags)
    )
  }

  public get printer() {
    return this.crudForm.value
  }

  testPrinter(ip: string | undefined) {
    if(ip) {
      this.printService.testConnection(ip).subscribe(status => {
        if(status) this._snackBar.open('Verbindung erfolgreich', '', { duration: 2000 });
        else this._snackBar.open('Verbindung fehlgeschlagen', '', { duration: 2000 });
      });
    }
  }
}
