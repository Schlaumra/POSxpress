import { MatDialogRef } from '@angular/material/dialog';

export abstract class AbstractDialog<TData, TDialog> {
  protected abstract dialogRef: MatDialogRef<TDialog>;
  protected abstract context: TData;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
