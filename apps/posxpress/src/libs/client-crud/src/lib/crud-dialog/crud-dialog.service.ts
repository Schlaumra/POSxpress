import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { AbstractDialogService } from '@px/client-dialog';
import { Observable, map } from 'rxjs';

export interface CrudOpenContext<TData> {
  readonly data: TData;
  readonly edit: boolean;
}

export enum DialogCode {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  CANCEL = 'cancel',
}

interface GenericContext<TData, Code extends DialogCode = DialogCode> {
  readonly code: Code;
  readonly data: TData;
}

type CreateContext<TData> = GenericContext<TData, DialogCode.CREATE>
type EditContext<TData> = GenericContext<TData, DialogCode.EDIT>
type DeleteContext<TData> = GenericContext<TData, DialogCode.DELETE>
type CancelContext = GenericContext<undefined, DialogCode.CANCEL>

export type CrudCloseContext<TData> = CreateContext<TData> | EditContext<TData> | DeleteContext<TData> | CancelContext

export class CrudDialogService<
  TData,
  TDialogComponent,
  TOpenContext extends CrudOpenContext<TData> = CrudOpenContext<TData>,
> extends AbstractDialogService<TDialogComponent, TOpenContext, CrudCloseContext<TData>> {
  constructor(
    dialog: MatDialog,
    crudDialogComponent: ComponentType<TDialogComponent>
  ) {
    super(dialog, crudDialogComponent);
  }

  openCrudDialog(context: TOpenContext): Observable<CrudCloseContext<TData>> {
    return super.openDialog(context).pipe(
      map((result) => {
        if (result?.code === DialogCode.CANCEL || !result) {
          return { data: undefined, code: DialogCode.CANCEL };
        } else {
          return result;
        }
      })
    );
  }
}
