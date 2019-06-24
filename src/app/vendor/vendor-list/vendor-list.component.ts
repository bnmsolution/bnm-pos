import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Vendor } from 'pos-models';

import * as actions from '../../stores/actions/vendor.actions';
import { DeleteVendorDialogComponent } from '../delete-vendor-dialog/delete-vendor-dialog.component';

export interface VendorFilter {
  search: string;
}

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorListComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  dataSource: MatTableDataSource<Vendor>;
  filter$: Subject<VendorFilter>;
  displayedColumns = ['name', 'ownerName', 'phone', 'numberOfProducts', 'actions'];
  tableInitiated = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<any>) {
    this.filter$ = new Subject();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.select('vendors')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(vendors => {
        vendors ? this.initTable(vendors) : this.store.dispatch(new actions.LoadVendors());
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.vendorFilterFunction;
    this.dataSource.data = data;
    this.tableInitiated = true;
    this.filter$.subscribe(searchFilter => {
      this.dataSource.filter = JSON.stringify(searchFilter);
    });
  }

  deleteVendor(vendorId: string): void {
    this.dialog
      .open(DeleteVendorDialogComponent, {
        data: { vendorId }
      })
      .afterClosed()
      .pipe(
        filter(updated => updated),
        tap(() => this.openSnackBar('거래처가 삭제되었습니다'))
      ).subscribe();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '확인', { duration: 2000 });
  }

  /**
   * Filter function for string search
   * @param vendor
   * @param searchFilter
   */
  private vendorFilterFunction(vendor: Vendor, searchFilter: string): boolean {
    const filterObject: VendorFilter = JSON.parse(searchFilter);
    const str = [vendor.name, vendor.businessNumber, vendor.ownerName, vendor.phone].join('');

    return str.contains(filterObject.search);
  }
}
