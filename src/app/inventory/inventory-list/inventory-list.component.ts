import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {InventoryTransaction, InventoryTransactionType, Product} from 'pos-models';

import {detailExpand} from '../../shared/utils/animation';
import {FilterPeriod} from '../../shared/utils/filter-period';
import {isWithinInterval} from 'date-fns';

export interface InventoryFilter {
  search: string;
  transactionType: InventoryTransactionType;
  startDate: Date;
  endDate: Date;
  period: FilterPeriod;
}


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  animations: detailExpand,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryListComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<InventoryTransaction>;
  filter$: Subject<InventoryFilter>;
  unsubscribe$ = new Subject();
  displayedColumns = ['created', 'type', 'totalCost', 'quantity', 'expectedQuantity'];
  tableInitiated = false;
  product: Observable<Product>;
  productName: Observable<string>;
  types = InventoryTransactionType;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private store: Store<any>) {
    this.filter$ = new Subject();
  }

  ngOnInit() {
    this.product = this.route.data.pipe(
      map(data => data.product),
      tap(product => {
        const {inventoryTransactions} = product;
        this.setExpectedCount(inventoryTransactions);
        this.initTable(inventoryTransactions);
      })
    );
    this.productName = this.product.pipe(map(p => `${p.name}`));
    this.dataSource = new MatTableDataSource();


    // this.store.select('products')
    //   .pipe(
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe(products => {
    //     products ? this.products = products : this.store.dispatch(new actions.LoadProducts());
    //   });
    //
    // this.searchCtrl = new FormControl();
    // this.filteredProducts = this.searchCtrl.valueChanges
    //   .pipe(
    //     map(value => this.filterProducts(value))
    //   );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // selectProduct(product: Product) {
  //   this.productService.getProductWithInventoryTransaction(product.id)
  //     .subscribe(product => {
  //       this.selectedProduct = product;
  //     });
  //   this.searchCtrl.setValue('', {emitEvent: false});
  // }
  //
  // private filterProducts(filter: string): Product[] {
  //   if (filter.trim() === '') {
  //     return [];
  //   }
  //   return this.products.filter((p: Product) =>
  //     (p.name && p.name.contains(filter)) ||
  //     (p.sku && p.sku.contains(filter)) ||
  //     (p.barcode && p.barcode.contains(filter))
  //   );
  // }

  setExpectedCount(transactions: InventoryTransaction[]) {
    if (transactions.length) {
      let pervQuantity = transactions[0].quantity;
      transactions[0].expectedQuantity = pervQuantity;
      for (let i = 1; i < transactions.length; i++) {
        const t: any = transactions[i];
        t.expectedQuantity = pervQuantity += this.isIncreasedQuntity(t.type) ? t.quantity : -t.quantity;
        pervQuantity = t.expectedQuantity;
      }
    }
  }

  isIncreasedQuntity(type: InventoryTransactionType): boolean {
    return [
      InventoryTransactionType.Initial,
      InventoryTransactionType.Received,
      InventoryTransactionType.Restocked
    ].indexOf(type) !== -1;
  }

  private initTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (transaction: InventoryTransaction, filter: string) => {
      const filterObject: InventoryFilter = JSON.parse(filter);
      const {startDate, endDate, transactionType} = filterObject;

      if (startDate && endDate && !isWithinInterval(transaction.created, {start: startDate, end: endDate})) {
        return false;
      }

      if (transactionType !== InventoryTransactionType.All && transaction.type !== transactionType) {
        return false;
      }

      return true;
    };

    this.dataSource.data = data;
    this.tableInitiated = true;
    this.filter$.subscribe(filter => {
      this.dataSource.filter = JSON.stringify(filter);
    });
  }
}
