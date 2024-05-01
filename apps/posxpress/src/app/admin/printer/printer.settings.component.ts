import { Component } from '@angular/core';
import { AdminSettings } from '../settings';
import { IPrinter, ICreatePrinter } from '@px/interface';
import { PrinterSettingsService } from './printer.settings.service';
import { CrudDialogService, DialogCode } from '@px/client-crud';
import { MatDialog } from '@angular/material/dialog';
import { PrinterSettingsDialogComponent } from './printer.edit.dialog';

@Component({
  selector: 'px-printer.settings',
  templateUrl: './printer.settings.component.html',
  styleUrls: ['./printer.settings.component.scss'],
  providers: [
    {
      provide: CrudDialogService,
      deps: [MatDialog],
      useFactory: (matDialog: MatDialog) =>
        new CrudDialogService<IPrinter, PrinterSettingsDialogComponent>(
          matDialog,
          PrinterSettingsDialogComponent
        ),
    },
  ],
})
export class PrinterSettingsComponent extends AdminSettings {
  printers: IPrinter[] = [];

  constructor(
    private printerSettingsService: PrinterSettingsService,
    private crudDialogService: CrudDialogService<
      IPrinter,
      PrinterSettingsDialogComponent
    >
  ) {
    super();
    this.updatePrinters();
  }

  updatePrinters() {
    this.printerSettingsService
      .index()
      .subscribe((value) => (this.printers = value));
  }

  openDialog(printer: ICreatePrinter, edit: false): void;
  openDialog(printer: IPrinter, edit?: true): void;
  openDialog(printer: IPrinter, edit = true): void {
    this.crudDialogService
      .openCrudDialog({ data: printer, edit })
      .subscribe((result) => {
        console.log(result)
        switch (result.code) {
          case DialogCode.CREATE:
            this.printerSettingsService.create(result.data).subscribe();
            break;
          case DialogCode.EDIT:
            //TODO: Handle ENTITY NOT FOUND
            this.printerSettingsService
              .update(result.data._id, result.data)
              .subscribe();
            break;
          case DialogCode.DELETE:
            //TODO: Handle ENTITY NOT FOUND
            this.printerSettingsService.delete(result.data._id).subscribe();
            break;
          case DialogCode.CANCEL:
          default:
            break;
        }
        this.updatePrinters();
      });
  }

  addPrinter() {
    this.openDialog(
      { name: '', address: '', model: 'Epson TM-T20III', tags: [] },
      false
    );
  }
}
