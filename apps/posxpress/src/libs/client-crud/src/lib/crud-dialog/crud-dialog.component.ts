import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AsyncPipe } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AbstractDialog } from '@px/client-dialog';
import { CrudCloseContext, CrudOpenContext, DialogCode } from './crud-dialog.service';

@Component({
  selector: 'px-crud-dialog',
  templateUrl: 'crud-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, AsyncPipe, ReactiveFormsModule],
})
export class CrudDialogComponent<TData> extends AbstractDialog<CrudOpenContext<TData>, CrudDialogComponent<TData>>{
  @Input({required: true})
  public crudForm!: FormGroup
  
  constructor(
    protected dialogRef: MatDialogRef<CrudDialogComponent<TData>, CrudCloseContext<TData>>,
    @Inject(MAT_DIALOG_DATA) protected printerContext: CrudOpenContext<TData>,
  ) {
    super();
  }

  public save() {
    const code = this.printerContext.edit ? DialogCode.EDIT : DialogCode.CREATE
    this.dialogRef.close({ data: this.crudForm.value, code})
  }
}
