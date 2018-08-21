import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Store} from '@ngrx/store';
import {Customer} from 'pos-models';

import * as actions from 'src/app/stores/actions/customer.actions';
import {cloneDeep} from '../../shared/utils/lang';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Customer>;
  displayedColumns = ['name', 'phone', 'currentStorePoint', 'totalSalesAmount', 'averageSalesAmount', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private store: Store<any>
  ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.select('customers')
      .subscribe(customers => {
        if (customers) {
          const copy = cloneDeep(customers);
          copy.forEach(c => this.setAverageSalesAmount(c));
          this.dataSource.data = copy || [];
        } else {
          this.dataSource.data = [];
        }
      });
    this.store.dispatch(new actions.LoadCustomers());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setAverageSalesAmount(customer) {
    const {totalSalesAmount, totalSalesCount} = customer;
    if (totalSalesCount) {
      customer.averageSalesAmount = Math.round(totalSalesAmount / totalSalesCount);
    } else {
      customer.averageSalesAmount = 0;
    }
  }

  showCustomersSalesHistory(customerId: string) {
    // this.router.navigate(['./sales', { customerId }]);
  }
}
