import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AbstractCrudDialogComponent,
  CrudDialogComponent,
  CrudOpenContext,
} from '@px/client-crud';
import { IPrinter, MODELS } from '@px/interface';
import { Observable, map, startWith } from 'rxjs';
import { DataService } from '../../data/data.service';
import { PrintService } from '../../print/print.service';

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
    MatChipsModule,
    MatSnackBarModule,
    MatSelectModule,
    NgFor,
    MatIconModule,
    MatAutocompleteModule,
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
  modelGroups = MODELS;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  allTags: string[] = [];

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  protected crudForm: FormGroup<printerControl> = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    tags: [new Array<string>],
    model: ['RP820-WUE', Validators.required],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected printerContext: IPrinterOpenContext,
    private formBuilder: NonNullableFormBuilder,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private printService: PrintService
  ) {
    super();
    const {data, edit} = printerContext
    if(edit) {
      this.crudForm.setValue({
        name: data.name,
        address: data.address,
        model: data.model,
        tags: data.tags,
      });
    }

    this.dataService
      .getSettings()
      .subscribe((value) => (this.allTags = value.tags));
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
  }

  public get printer() {
    return this.crudForm.value
  }
  

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    this.printer.tags?.push(value);
    event.chipInput?.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.printer.tags?.indexOf(tag);

    if (index !== undefined && index >= 0) {
      this.printer.tags?.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.printer.tags?.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  testPrinter() {
    this._snackBar.open('Verbindung erfolgreich TODO', '', { duration: 2000 });
    this.printService.testConnection();
  }
}
