import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export abstract class AbstractDialogService<
  TDialogComponent,
  TOpenContext,
  TCloseContext
> {
  constructor(
    private dialog: MatDialog,
    private dialogComponent: ComponentType<TDialogComponent>
  ) {}

  protected openDialog(
    context: TOpenContext
  ): Observable<TCloseContext | undefined> {
    const ref = this.dialog.open<TDialogComponent, TOpenContext, TCloseContext>(
      this.dialogComponent,
      { data: context }
    );
    return ref.afterClosed();
  }
}
