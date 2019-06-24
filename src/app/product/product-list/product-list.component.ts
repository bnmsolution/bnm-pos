import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subject, merge } from 'rxjs';
import { takeUntil, mergeAll, mergeMap } from 'rxjs/operators';
import { Product } from 'pos-models';

import { detailExpand } from '../../shared/utils/animation';
import * as actions from '../../stores/actions/product.actions';
import { ImportProductDialogComponent } from '../import-product-dialog/import-product-dialog.component';
import { TableSettings, SortChange } from 'src/app/shared/interfaces/table';

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
  displayedColumns = ['name', 'created', 'category', 'vendor', 'retailPrice', 'count', 'options', 'actions'];
  tableInitiated = false;
  expandedElement;

  tableSettings: TableSettings = {
    pageSize: 10,
    sortActive: 'name',
    sortDirection: 'asc'
  };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private store: Store<any>) {
    this.filter$ = new Subject();
    this.loadSettings();
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

  loadSettings() {
    const tableSettings = localStorage.getItem('ProductListComponent.tableSettings');
    if (tableSettings) {
      this.tableSettings = JSON.parse(tableSettings);
    }
  }

  storeSettings() {
    localStorage.setItem('ProductListComponent.tableSettings', JSON.stringify(this.tableSettings));
  }

  openDialog() {
    this.dialog.open(ImportProductDialogComponent, { width: '700px' });
  }

  private initTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.productFilterFunction;
    this.dataSource.sortData = this.sortFunction;
    this.dataSource.data = data;
    this.tableInitiated = true;
    this.filter$.subscribe(filter => {
      this.dataSource.filter = JSON.stringify(filter);
    });

    this.paginator.page.subscribe((pageEvent: PageEvent) => {
      this.tableSettings.pageSize = pageEvent.pageSize;
      this.storeSettings();
    });

    this.sort.sortChange.subscribe((sortChange: SortChange) => {
      this.tableSettings.sortActive = sortChange.active;
      this.tableSettings.sortDirection = sortChange.direction;
      this.storeSettings();
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

  private sortFunction(data: Product[], sort: MatSort): Product[] {
    const compare = (a, b) => a.trim().localeCompare(b.trim());
    switch (sort.active) {
      case 'name': {
        return sort.direction === 'asc' ? data.sort((a, b) => compare(a.name, b.name)) :
          data.sort((a, b) => compare(b.name, a.name));
      }
      case 'created': {
        return sort.direction === 'asc' ? data.sort((a, b) => compare(a.created, b.created)) :
          data.sort((a, b) => compare(b.created, a.created));
      }
      case 'category': {
        return data.sort((a, b) => {
          const aVal = a.category ? a.category.name : '';
          const bVal = b.category ? b.category.name : '';
          return sort.direction === 'asc' ? compare(aVal, bVal) : compare(bVal, aVal);
        });
      }
      case 'vendor': {
        return data.sort((a, b) => {
          const aVal = a.vendor ? a.vendor.name : '';
          const bVal = b.vendor ? b.vendor.name : '';
          return sort.direction === 'asc' ? compare(aVal, bVal) : compare(bVal, aVal);
        });
      }
      case 'retailPrice': {
        return sort.direction === 'asc' ? data.sort((a, b) => a.retailPrice - b.retailPrice) :
          data.sort((a, b) => b.retailPrice - a.retailPrice);
      }
      case 'count': {
        return sort.direction === 'asc' ? data.sort((a, b) => a.count - b.count) :
          data.sort((a, b) => b.count - a.count);
      }
      case 'options': {
        return sort.direction === 'asc' ? data.sort((a, b) => a.variants.length - b.variants.length) :
          data.sort((a, b) => b.variants.length - a.variants.length);
      }
      default: return data;
    }
  }

}
