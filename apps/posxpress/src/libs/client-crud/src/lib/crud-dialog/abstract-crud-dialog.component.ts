import { AbstractDialog } from '@px/client-dialog';
import { AbstractControl, FormGroup } from '@angular/forms';

export abstract class AbstractCrudDialogComponent<
  TOpenContext,
  TDataControl extends { [K in keyof TDataControl]: AbstractControl<any, any> }
> extends AbstractDialog<
  TOpenContext,
  AbstractCrudDialogComponent<TOpenContext, TDataControl>
> {
  protected abstract crudForm: FormGroup<TDataControl>;
}
