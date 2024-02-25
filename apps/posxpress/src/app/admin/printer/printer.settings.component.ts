import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { AdminSettings } from '../settings'
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../../data/data.service';
import { PrintService } from '../../print/print.service';
import { MODELS, IPrinter, ICreatePrinter } from '@px/interface';
import { PrinterSettingsService } from './printer.settings.service'


@Component({
  selector: 'org-printer.settings',
  templateUrl: './printer.settings.component.html',
  styleUrls: ['./printer.settings.component.scss'],
})
export class PrinterSettingsComponent extends AdminSettings {
  printers: IPrinter[] = [];

  constructor(public dialog: MatDialog, private printerSettingsService: PrinterSettingsService) {
    super();
    this.updatePrinters();
  }

  updatePrinters() {
    this.printerSettingsService.index().subscribe((value) => (this.printers = value));
  }

  openDialog(printer: ICreatePrinter, newlyCreated: true): void
  openDialog(printer: IPrinter, newlyCreated?: false): void
  openDialog(printer: IPrinter, newlyCreated = false): void {
    const dialogRef = this.dialog.open(PrinterSettingsDialogComponent, {
      data: {
        printer: printer,
        new: newlyCreated,
      },
    });

    dialogRef.afterClosed().subscribe((result: (IPrinter) & {code?: 'DELETE'}) => { // TODO: This should also be Icreate
      if (result?.code === 'DELETE') {
        this.printerSettingsService.delete(result._id).subscribe();
      } else if (result) {
        const index = this.printers.findIndex(
          (value: IPrinter) => value._id === result._id
        );
        if (index !== -1) {
          this.printerSettingsService.update(result._id, result).subscribe();
        } else {
          this.printerSettingsService.create(result).subscribe();
        }
      }
      this.updatePrinters();
    });
  }

  addPrinter() {
    this.openDialog(
      { name: '', address: '', model: 'Epson TM-T20III', tags: [] },
      true
    );
  }
}

@Component({
  selector: 'org-printer.settings.dialog',
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
  ],
  providers: [DataService, PrintService]
})
export class PrinterSettingsDialogComponent {
  printer: IPrinter;
  modelGroups = MODELS;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  allTags: string[] = [];

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { printer: IPrinter | ICreatePrinter; new?: boolean },
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private printService: PrintService
  ) {
    this.dataService.getSettings().subscribe((value) => (this.allTags = value.tags));
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
    this.printer = JSON.parse(JSON.stringify(this.data.printer));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    this.printer.tags.push(value);

    // Clear the input value
    event.chipInput?.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.printer.tags.indexOf(tag);

    if (index >= 0) {
      this.printer.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.printer.tags.push(event.option.viewValue);
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
    this._snackBar.open('Verbindung erfolgreich', '', { duration: 2000 });
    this.printService.testConnection()
  }
}