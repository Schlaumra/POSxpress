import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { AbstractDialogService } from '@px/client-dialog';
import { EMPTY, Observable, map, switchMap } from 'rxjs';
import { AbstractCrudService } from '../abstract-crud.service';

export interface CrudEntity {
  _id: string;
}

export interface CrudOpenContext<TData extends CrudEntity> {
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
  readonly original: TData;
}

type CreateContext<TData> = GenericContext<TData, DialogCode.CREATE>;
type EditContext<TData> = GenericContext<TData, DialogCode.EDIT>;
type DeleteContext<TData> = GenericContext<TData, DialogCode.DELETE>;
type CancelContext = GenericContext<undefined, DialogCode.CANCEL>;

export type CrudCloseContext<TData> =
  | CreateContext<TData>
  | EditContext<TData>
  | DeleteContext<TData>
  | CancelContext;

export class CrudDialogService<
  TData extends CrudEntity,
  TDialogComponent,
  TOpenContext extends CrudOpenContext<TData> = CrudOpenContext<TData>
> extends AbstractDialogService<
  TDialogComponent,
  TOpenContext,
  CrudCloseContext<TData>
> {
  constructor(
    dialog: MatDialog,
    crudDialogComponent: ComponentType<TDialogComponent>,
    private readonly crudService: AbstractCrudService<TData, unknown, unknown>
  ) {
    super(dialog, crudDialogComponent);
  }

  openCrudDialog(context: TOpenContext): Observable<TData | undefined> {
    return super.openDialog(context).pipe(
      switchMap((result) => {
        switch (result?.code) {
          case DialogCode.CREATE:
            return this.crudService.create(result.data);
          case DialogCode.EDIT:
            //TODO: Handle ENTITY NOT FOUND
            return this.crudService.update(result.original._id, result.data)
          case DialogCode.DELETE:
            //TODO: Handle ENTITY NOT FOUND
            return this.crudService.delete(result.original._id).pipe(map(() => undefined));
          case DialogCode.CANCEL:
          default:
            return EMPTY
        }
      }),
    );
  }
}
