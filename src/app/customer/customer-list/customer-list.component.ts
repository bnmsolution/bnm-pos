import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Store} from '@ngrx/store';
import {Customer} from 'pos-models';

import * as actions from 'src/app/stores/actions/customer.actions';
import {cloneDeep} from '../../shared/utils/lang';
import {detailExpand} from '../../shared/utils/animation';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  animations: detailExpand,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Customer>;
  unsubscribe$ = new Subject();
  displayedColumns = ['name', 'phone', 'currentStorePoint', 'totalSalesAmount', 'averageSalesAmount', 'actions'];
  tableInitiated = false;

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
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(customers => {
        if (customers) {
          const copyCoustomers = cloneDeep(customers);
          copyCoustomers.forEach(c => this.setAverageSalesAmount(c));
          this.initTable(copyCoustomers);
        } else {
          this.store.dispatch(new actions.LoadCustomers());
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = data;
    this.tableInitiated = true;
  }

  setAverageSalesAmount(customer) {
    const {totalSalesAmount, totalSalesCount} = customer;
    if (totalSalesCount) {
      customer.averageSalesAmount = Math.round(totalSalesAmount / totalSalesCount);
    } else {
      customer.averageSalesAmount = 0;
    }
  }
}
