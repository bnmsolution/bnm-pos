import {Component, OnInit, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Category, Product, Vendor, Tax} from 'pos-models';

import {detailExpand} from '../../shared/utils/animation';
import * as actions from '../../stores/actions/product.actions';

export interface ProductFilter {
  searchValue: string;
  categoryId: string;
  vendorId: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  animations: detailExpand
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource: MatTableDataSource<Product>;
  filter: ProductFilter;
  filterChange = new Subject();
  unsubscribe$ = new Subject();
  displayedColumns = ['name', 'created', 'category', 'vendor', 'retailPrice', 'count', 'actions'];

  // for filter select
  categories: Category[] = [];
  vendors: Vendor[] = [];
  taxes: Tax[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private store: Store<any>) {
    this.filter = this.getEmptyFilter();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.route
      .queryParams
      .subscribe(params => {
        if (params.category) {
          this.filter.categoryId = params.category;
          this.setFilter();
        }

        if (params.vendor) {
          this.filter.vendorId = params.vendor;
          this.setFilter();
        }
      });

    this.route.data
      .subscribe((data) => {
        this.categories = data.categories;
        this.vendors = data.vendors;
        this.taxes = data.taxes;
      });

    this.store.select('products')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(products => {
        this.dataSource.data = products || [];
      });
    this.store.dispatch(new actions.LoadProducts());

    this.initFilter();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onFilterCleared() {
    this.filter = this.getEmptyFilter();
    this.dataSource.filter = JSON.stringify(this.filter);
  }

  private initFilter() {
    this.filterChange.subscribe(filter => this.setFilter());

    // custom filter function
    this.dataSource.filterPredicate = (product: Product, filter: string) => {
      const filterObject = JSON.parse(filter);

      if (filterObject.categoryId.length > 0 && product.categoryId !== filterObject.categoryId) {
        return false;
      }

      if (filterObject.vendorId.length > 0 && product.vendorId !== filterObject.vendorId) {
        return false;
      }

      const str = [product.name, product.sku, product.barcode].join('');

      return str.contains(filterObject.searchValue);
    };
  }

  private setFilter() {
    this.dataSource.filter = JSON.stringify(this.filter);
  }

  private getEmptyFilter(): ProductFilter {
    return {
      searchValue: '',
      categoryId: '',
      vendorId: ''
    };
  }
}
