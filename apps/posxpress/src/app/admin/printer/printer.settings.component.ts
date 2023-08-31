import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { AdminSettings } from '../settings'
import { MODELS, Printer } from '../../../../../../libs/interface';
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
import { v4 as uuidv4 } from 'uuid';
import { DataService } from '../../data/data.service';


@Component({
  selector: 'org-printer.settings',
  templateUrl: './printer.settings.component.html',
  styleUrls: ['./printer.settings.component.scss'],
})
export class PrinterSettingsComponent extends AdminSettings{
  printers: Printer[] = []

  constructor(public dialog: MatDialog, private data: DataService) {
    super()
    this.data.getPrinters().subscribe(value => this.printers = value)
  }


  openDialog(printer: Printer, newlyCreated=false) {
    const dialogRef = this.dialog.open(PrinterSettingsDialogComponent, {
      data: {
        printer: printer,
        new: newlyCreated
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.code === 'DELETE') {
        this.printers = this.printers.filter((value) => value.id !== result.id)
      }
      else if (result) {
        const index = this.printers.findIndex((value: Printer) => value.id === result.id)
        if (index !== -1) {
          this.printers[index] = result
        }
        else {
          this.printers.push(result)
        }
      }
    });
  }

  addPrinter() {
    this.openDialog({ id: uuidv4(), name: '', address: '', model: "Epson TM-T20III", tags: []}, true)
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
})
export class PrinterSettingsDialogComponent {
  printer: Printer
  modelGroups = MODELS
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  allTags: string[] = ['Essen', 'Trinken']; // TODO ask DB

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { printer: Printer, new?: boolean }, private _snackBar: MatSnackBar) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
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

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  testPrinter() {
    this._snackBar.open('Verbindung erfolgreich', '', {duration: 2000});
  }
}