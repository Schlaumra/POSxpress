import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractCrudDialogComponent,
  CrudDialogComponent,
  CrudOpenContext,
} from '@px/client-crud';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormTagSelectComponent } from '@px/client-forms';
import { IProduct, Ingredient } from '@px/interface';
import { Observable, map } from 'rxjs';
import { DataService } from '../../data/data.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export type IProductOpenContext = CrudOpenContext<IProduct>;

interface IngredientControl {
  name: FormControl<string>;
  contained: FormControl<boolean>;
  extraPrice: FormControl<number>;
  // changed?: boolean;
}

interface ProductControl {
  name: FormControl<string>;
  price: FormControl<number>;
  tags: FormControl<string[]>;
  inStock: FormControl<boolean>;
  ingredients: FormArray<FormGroup<IngredientControl>>;
  // info: FormControl<string | undefined>;
  // note: FormControl<string | undefined>;
}

@Component({
  selector: 'px-product.settings.dialog',
  templateUrl: 'product.edit.dialog.html',
  styleUrls: ['product.edit.dialog.scss'],
  standalone: true,
  imports: [
    FormTagSelectComponent,
    CrudDialogComponent,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    NgFor,
    NgIf,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [DataService],
})
export class ProductSettingsDialogComponent extends AbstractCrudDialogComponent<
  IProductOpenContext,
  ProductControl
> {
  ingredientsExpanded = false;

  protected crudForm: FormGroup<ProductControl> = this.formBuilder.group({
    name: ['', Validators.required],
    price: [0, Validators.required],
    tags: [new Array<string>()],
    inStock: [false, Validators.required],
    ingredients: this.formBuilder.array<FormGroup<IngredientControl>>([]),
    // info: this.formBuilder.control<string | undefined>(''),
    // note: this.formBuilder.control<string | undefined>(''),
  });

  constructor(
    protected dialogRef: MatDialogRef<ProductSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) protected context: IProductOpenContext,
    private formBuilder: NonNullableFormBuilder,
    protected dataService: DataService
  ) {
    super();
    const data: IProduct = JSON.parse(JSON.stringify(context.data))
    if (context.edit) {
      this.crudForm.patchValue(data);
      if (data.ingredients && data.ingredients.length > 0) {
        this.ingredientsExpanded = true;
        data.ingredients.forEach((ingredient) =>
          this.crudForm.controls.ingredients.push(
            this.getIngredientsControl(ingredient)
          )
        );
      }
    }
  }

  public get product() {
    return this.crudForm.value;
  }

  addNewIngredient() {
    this.crudForm.controls.ingredients.push(this.getIngredientsControl());
    this.ingredientsExpanded = true;
  }

  removeIngredient(ingredientIndex: number) {
    this.crudForm.controls.ingredients.removeAt(ingredientIndex);
  }

  private getIngredientsControl(ingredient?: Ingredient) {
    const fg = this.formBuilder.group({
      name: [''],
      contained: this.formBuilder.control<boolean>(false),
      extraPrice: [0],
    });
    if (ingredient) fg.patchValue(ingredient);
    return fg;
  }
}
