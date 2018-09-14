import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatDialog, MatSnackBar, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {Vendor} from 'pos-models';

import * as actions from '../../stores/actions/vendor.actions';
import {DeleteVendorDialogComponent} from '../delete-vendor-dialog/delete-vendor-dialog.component';


@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  dataSource: MatTableDataSource<Vendor>;
  displayedColumns = ['name', 'ownerName', 'phone', 'numberOfProducts', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<any>) {
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
    this.dataSource.data = data;
  }

  deleteVendor(vendorId: string): void {
    this.dialog
      .open(DeleteVendorDialogComponent, {
        data: {vendorId}
      })
      .afterClosed()
      .pipe(
        filter(updated => updated),
        tap(() => this.openSnackBar('직원이 삭제되었습니다'))
      ).subscribe();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '확인', {duration: 2000});
  }
}
