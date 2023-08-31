import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AsyncPipe } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AbstractDialog } from '@px/client-dialog';
import { CrudCloseContext, CrudEntity, CrudOpenContext, DialogCode } from './crud-dialog.service';

@Component({
  selector: 'px-crud-dialog',
  templateUrl: 'crud-dialog.component.html',
  styleUrls: [
    'crud-dialog.component.scss'
  ],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, AsyncPipe, ReactiveFormsModule],
})
export class CrudDialogComponent<TData extends CrudEntity> extends AbstractDialog<CrudOpenContext<TData>, CrudDialogComponent<TData>>{
  @Input({required: true})
  public crudForm!: FormGroup
  
  constructor(
    protected dialogRef: MatDialogRef<CrudDialogComponent<TData>, CrudCloseContext<TData>>,
    @Inject(MAT_DIALOG_DATA) protected context: CrudOpenContext<TData>,
  ) {
    super();
  }

  public save() {
    const code = this.context.edit ? DialogCode.EDIT : DialogCode.CREATE
    // TODO: Data should be crudFormGroupInterface
    this.dialogRef.close({ data: this.crudForm.value, code, original: this.context.data})
  }

  public remove() {
    this.dialogRef.close({ data: this.crudForm.value, code: DialogCode.DELETE, original: this.context.data })
  }
}
