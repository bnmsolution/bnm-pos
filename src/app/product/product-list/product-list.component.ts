import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'pos-models';

import { detailExpand } from '../../shared/utils/animation';
import * as actions from '../../stores/actions/product.actions';
import { ImportProductDialogComponent } from '../import-product-dialog/import-product-dialog.component';

export interface ProductFilter {
  search: string;
  categoryId: string;
  vendorId: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  animations: detailExpand,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<Product>;
  filter$: Subject<ProductFilter>;
  unsubscribe$ = new Subject();
  displayedColumns = ['name', 'created', 'category', 'vendor', 'retailPrice', 'count', 'actions'];
  tableInitiated = false;
  expandedElement;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private store: Store<any>) {
    this.filter$ = new Subject();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.select('products')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(products => {
        products ? this.initTable(products) : this.store.dispatch(new actions.LoadProducts());
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openDialog() {
    this.dialog.open(ImportProductDialogComponent, { width: '700px' });
  }

  private initTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.productFilterFunction;
    this.dataSource.data = data;
    this.tableInitiated = true;
    this.filter$.subscribe(filter => {
      this.dataSource.filter = JSON.stringify(filter);
    });
  }

  /**
   * Filter funtion for string search.
   * @param product
   * @param filter
   */
  private productFilterFunction(product: Product, filter: string): boolean {
    const filterObject: ProductFilter = JSON.parse(filter);

    if (filterObject.categoryId.length > 0 && product.categoryId !== filterObject.categoryId) {
      return false;
    }

    if (filterObject.vendorId.length > 0 && product.vendorId !== filterObject.vendorId) {
      return false;
    }

    const str = [product.name, product.sku, product.barcode].join('');

    return str.contains(filterObject.search);
  }
}
