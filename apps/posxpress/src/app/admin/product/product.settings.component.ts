import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { AdminSettings } from '../settings'
import { Product } from 'libs/interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { DataService } from '../../data/data.service';


@Component({
  selector: 'org-product.settings',
  templateUrl: './product.settings.component.html',
  styleUrls: ['./product.settings.component.scss'],
})
export class ProductSettingsComponent extends AdminSettings {
  title = "Benutzer"
  displayedColumns: string[] = ['select', 'name', 'price', 'inStock', 'tags', 'actions'];
  dataSource: Product[] = [];
  selection = new SelectionModel<Product>(true, []);
  selected: Product[] = []

  constructor(public dialog: MatDialog, private data: DataService) {
    super()
    this.updateDataSource()
    this.selection.changed.subscribe(value => this.selected = value.source.selected);
  }

  updateDataSource() {
    this.data.getProducts().subscribe(value => this.dataSource = value)
  }

  openDialog(product: Product, newlyCreated=false) {
    const dialogRef = this.dialog.open<any, { product: Product; new: boolean }>(
      ProductSettingsDialogComponent,
      {
        data: {
          product: product,
          new: newlyCreated,
        },
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        const index = this.dataSource.findIndex((value: Product) => value._id === result._id)
        if (index !== -1) {
          this.data.updateProduct(result).subscribe()
        }
        else {
          this.data.addProduct(result).subscribe()
          this.createProduct()
        }
        this.updateDataSource()
      }
    });
  }

  createProduct() {
    // TODO solve how to do with id
    this.openDialog({name: '', price: 0, tags: [], inStock: true}, true)
  }

  deleteProduct() {
    this.selected.forEach((product: Product) => {
      this.data.deleteProduct(product).subscribe()
      this.dataSource = [...this.dataSource.filter(dataValue => product._id !== dataValue._id)]
    })
    this.selection.clear()
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }
}

@Component({
  selector: 'org-product.settings.dialog',
  templateUrl: 'product.edit.dialog.html',
  standalone: true,
  imports: [
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
export class ProductSettingsDialogComponent {
  product: Product;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  allTags: string[] = [];
  ingredientsExpanded = false;

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { product: Product; new?: boolean },
    private dataService: DataService
  ) {
    this.dataService.getSettings().subscribe((value) => (this.allTags = value.tags));
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
    this.product = JSON.parse(JSON.stringify(this.data.product));
  }

  addNewIngredient() {
    if (!this.product.ingredients) {
      this.product.ingredients = [];
    }
    this.product.ingredients.push({ name: '', contained: true, extraPrice: 0 });
    this.ingredientsExpanded = true;
  }

  removeIngredient(ingredientIndex: number) {
    this.product.ingredients = this.product.ingredients?.filter(
      (_, index) => index !== ingredientIndex
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.product.tags.push(value);
    }

    // Clear the input value
    event.chipInput?.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.product.tags.indexOf(tag);

    if (index >= 0) {
      this.product.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.product.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }
}