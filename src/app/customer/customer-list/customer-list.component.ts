import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Customer } from 'pos-models';

import * as actions from 'src/app/stores/actions/customer.actions';
import { cloneDeep } from '../../shared/utils/lang';
import { detailExpand } from '../../shared/utils/animation';
import { CustomerService } from 'src/app/core';
import { CustomerQuickEditDialogComponent } from 'src/app/register/customer-quick-edit-dialog/customer-quick-edit-dialog.component';

export interface CustomerFilter {
  search: string;
}

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
  filter$: Subject<CustomerFilter>;
  displayedColumns = ['name', 'phone', 'currentStorePoint', 'totalSalesAmount', 'averageSalesAmount', 'actions'];
  tableInitiated = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private store: Store<any>
  ) {
    this.filter$ = new Subject();
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

  openCustomerInfoDialog(customerId: string) {
    this.customerService.getItemById(customerId)
      .subscribe(customer => {
        this.dialog.open(CustomerQuickEditDialogComponent, {
          autoFocus: false,
          data: customer
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.customerFilterFunction;
    this.dataSource.data = data;
    this.tableInitiated = true;
    this.filter$.subscribe(searchFilter => {
      this.dataSource.filter = JSON.stringify(searchFilter);
    });
  }

  setAverageSalesAmount(customer) {
    const { totalSalesAmount, totalSalesCount } = customer;
    if (totalSalesCount) {
      customer.averageSalesAmount = Math.round(totalSalesAmount / totalSalesCount);
    } else {
      customer.averageSalesAmount = 0;
    }
  }

  /**
   * Filter function for string search
   * @param vendor
   * @param searchFilter
   */
  private customerFilterFunction(customer: Customer, searchFilter: string): boolean {
    const filterObject: CustomerFilter = JSON.parse(searchFilter);
    const str = [customer.name, customer.phone].join('');

    return str.contains(filterObject.search);
  }
}
