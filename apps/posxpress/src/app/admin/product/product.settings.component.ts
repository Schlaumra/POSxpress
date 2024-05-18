import { SelectionModel } from '@angular/cdk/collections';
import {
  Component
} from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';
import { ICreateProduct, IProduct } from '@px/interface';
import { AdminSettings } from '../settings';
import { ProductSettingsService } from './product.settings.service';
import { ProductSettingsDialogComponent } from './product.edit.dialog'
import { CrudDialogService } from '@px/client-crud';

@Component({
  selector: 'px-product.settings',
  templateUrl: './product.settings.component.html',
  styleUrls: ['./product.settings.component.scss'],
  providers: [
    {
      provide: CrudDialogService,
      deps: [MatDialog, ProductSettingsService],
      useFactory: (matDialog: MatDialog, productSettingsService: ProductSettingsService) =>
        new CrudDialogService<IProduct, ProductSettingsDialogComponent>(
          matDialog,
          ProductSettingsDialogComponent,
          productSettingsService
        ),
    },
  ]
})
export class ProductSettingsComponent extends AdminSettings {
  title = 'Benutzer';
  displayedColumns: string[] = [
    'select',
    'name',
    'price',
    'inStock',
    'tags',
    'actions',
  ];
  dataSource: IProduct[] = [];
  selection = new SelectionModel<IProduct>(true, []);
  selected: IProduct[] = [];

  constructor(
    public dialog: MatDialog,
    private productSettingsService: ProductSettingsService,
    private crudDialogService: CrudDialogService<
    IProduct,
    ProductSettingsDialogComponent
  >
  ) {
    super();
    this.updateDataSource();
    this.selection.changed.subscribe(
      (value) => (this.selected = value.source.selected)
    );
  }

  updateDataSource() {
    this.productSettingsService
      .index()
      .subscribe((value) => (this.dataSource = value));
  }

  openDialog(data: ICreateProduct, edit: false): void;
  openDialog(data: IProduct, edit?: true): void;
  openDialog(data: IProduct, edit = true): void {
    this.crudDialogService.openCrudDialog({ data, edit })
    .subscribe(() => this.updateDataSource())
  }

  createProduct() {
    this.openDialog({ name: '', price: 0, tags: [], inStock: true }, false);
  }

  deleteProduct() {
    this.selected.forEach((product: IProduct) => {
      this.productSettingsService.delete(product._id).subscribe();
      this.dataSource = [
        ...this.dataSource.filter((dataValue) => product._id !== dataValue._id),
      ];
    });
    this.selection.clear();
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
