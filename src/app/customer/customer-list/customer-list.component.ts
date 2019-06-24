import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Customer } from 'pos-models';

import * as actions from 'src/app/stores/actions/customer.actions';
import { cloneDeep } from '../../shared/utils/lang';
import { detailExpand } from '../../shared/utils/animation';
import { CustomerService } from 'src/app/core';
import { CustomerQuickEditDialogComponent } from 'src/app/register/customer-quick-edit-dialog/customer-quick-edit-dialog.component';
import { TableSettings, SortChange } from 'src/app/shared/interfaces/table';
import { AddCustomerDialogComponent } from '../../shared/components/add-customer-dialog/add-customer-dialog.component';

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
  displayedColumns = ['name', 'totalSalesAmount', 'averageSalesAmount', 'totalSalesCount',
    'totalStorePoint', 'currentStorePoint', 'lastPurchasedDate', 'actions'];
  tableInitiated = false;

  tableSettings: TableSettings = {
    pageSize: 10,
    sortActive: 'totalSalesAmount',
    sortDirection: 'desc'
  };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private store: Store<any>
  ) {
    this.filter$ = new Subject();
    this.loadSettings();
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

  loadSettings() {
    const tableSettings = localStorage.getItem('CustomerListComponent.tableSettings');
    if (tableSettings) {
      this.tableSettings = JSON.parse(tableSettings);
    }
  }

  storeSettings() {
    localStorage.setItem('CustomerListComponent.tableSettings', JSON.stringify(this.tableSettings));
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

  /**
   * Open add/edit customer dialog.
   */
  openAddCustomerDialog(editCustomer?: Customer) {
    this.dialog
      .open(AddCustomerDialogComponent, { maxWidth: 600, data: { customer: editCustomer ? cloneDeep(editCustomer) : null } });
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

  private setAverageSalesAmount(customer) {
    const { totalSalesAmount, totalSalesCount } = customer;
    if (totalSalesCount) {
      customer.averageSalesAmount = Math.round(totalSalesAmount / totalSalesCount);
    } else {
      customer.averageSalesAmount = 0;
    }
  }

  /**
   * Filter function for string search.
   */
  private customerFilterFunction(customer: Customer, searchFilter: string): boolean {
    const filterObject: CustomerFilter = JSON.parse(searchFilter);
    const str = [customer.name, customer.phone].join('');
    return str.contains(filterObject.search);
  }
}
