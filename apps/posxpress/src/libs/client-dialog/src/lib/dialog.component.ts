import { MatDialogRef } from '@angular/material/dialog';

export abstract class AbstractDialog<TData, TDialog> {
  protected abstract dialogRef: MatDialogRef<TDialog>;
  protected abstract printerContext: TData;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
