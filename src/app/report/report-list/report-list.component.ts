import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RegisterSale, Product } from 'pos-models';

import * as salesListActions from 'src/app/stores/actions/sales.actions';
import * as productListActions from 'src/app/stores/actions/product.actions';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  sales: RegisterSale[];
  products: Product[];
  unsubscribe$ = new Subject();

  constructor(
    private store: Store<any>,
  ) { }


  ngOnInit() {
    this.store.select('sales')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(sales => {
        sales ? this.sales = sales : this.store.dispatch(new salesListActions.LoadSales());
      });

    this.store.select('products')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(products => {
        products ? this.products = products : this.store.dispatch(new productListActions.LoadProducts());
      });
  }

}
