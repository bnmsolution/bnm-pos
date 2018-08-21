import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Store} from '@ngrx/store';
import {filter, tap} from 'rxjs/operators';
import {EmployeeRole} from 'pos-models';

import * as actions from '../../stores/actions/employee.actions';
import {DeleteEmployeeDialogComponent} from '../delete-employee-dialog/delete-employee-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  dataSource: any;
  roles = EmployeeRole;
  displayedColumns = ['code', 'name', 'phone', 'role', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<any>) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.select('employees')
      .subscribe(employees => {
        this.dataSource.data = employees || [];
      });
    this.store.dispatch(new actions.LoadEmployees());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  deleteEmployee(employeeId: string): void {
    this.dialog
      .open(DeleteEmployeeDialogComponent, {
        data: {employeeId}
      })
      .afterClosed()
      .pipe(
        filter(updated => updated),
        tap(() => this.openSnackBar('직원이 삭제되었습니다'))
      )
      .subscribe();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '확인', {duration: 2000});
  }

}
