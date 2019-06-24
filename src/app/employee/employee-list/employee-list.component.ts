import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { EmployeeRole, Employee } from 'pos-models';

import * as actions from '../../stores/actions/employee.actions';
import { DeleteEmployeeDialogComponent } from '../delete-employee-dialog/delete-employee-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Employee>;
  roles = EmployeeRole;
  displayedColumns = ['code', 'name', 'phone', 'role', 'actions'];
  unsubscribe$ = new Subject();
  tableInitiated = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<any>) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.select('employees')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(categories => {
        categories ? this.initTable(categories) : this.store.dispatch(new actions.LoadEmployees());
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

  deleteEmployee(employeeId: string): void {
    this.dialog
      .open(DeleteEmployeeDialogComponent, {
        data: { employeeId }
      })
      .afterClosed()
      .pipe(
        filter(updated => updated),
        tap(() => this.openSnackBar('직원이 삭제되었습니다'))
      )
      .subscribe();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '확인', { duration: 2000 });
  }

}
