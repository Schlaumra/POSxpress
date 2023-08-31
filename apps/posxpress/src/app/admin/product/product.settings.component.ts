import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  ViewChild
} from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';
import { ICreateProduct, IProduct } from '@px/interface';
import { AdminSettings } from '../settings';
import { ProductSettingsService } from './product.settings.service';
import { ProductSettingsDialogComponent } from './product.edit.dialog'
import { CrudDialogService } from '@px/client-crud';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';

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
  @ViewChild('table') table!: MatTable<IProduct>;

  title = 'Benutzer';
  displayedColumns: string[] = [
    'position',
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
      .subscribe((value) => (this.dataSource = value.sort((a, b) => a.position - b.position)));
  }

  openDialog(data: ICreateProduct, edit: false): void;
  openDialog(data: IProduct, edit?: true): void;
  openDialog(data: IProduct, edit = true): void {
    this.crudDialogService.openCrudDialog({ data, edit })
    .subscribe(() => this.updateDataSource())
  }

  createProduct() {
    this.openDialog({ position: this.dataSource.length, name: '', price: 0, tags: [], inStock: true }, false);
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
  
  dropTable(event: CdkDragDrop<IProduct[], IProduct[], IProduct>) {
    const product = event.item.data
    const prevIndex = this.dataSource.findIndex((d) => d === product);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    const idArray = this.dataSource.map(value => value._id)
    this.table.renderRows();
    this.productSettingsService.updateSorting(idArray).subscribe(() => this.updateDataSource())
  }
}
