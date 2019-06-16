import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { share, mergeMap, map, filter } from 'rxjs/operators';

import * as employeeActions from '../actions/employee.actions';
import { EmployeeService } from 'src/app/core';

@Injectable()
export class EmployeeEffects {

  @Effect() getEmployees$ = this.actions$
    .pipe(
      ofType(employeeActions.LOAD_EMPLOYEES),
      mergeMap((action: employeeActions.LoadEmployees) => {
        return this.employeeService.getAll();
      }),
      map(categories => new employeeActions.LoadEmployeesSuccess(categories))
    );


  @Effect() addEmployee$ = this.actions$
    .pipe(
      ofType(employeeActions.ADD_EMPLOYEE),
      mergeMap((action: employeeActions.AddEmployee) => {
        return this.employeeService.addItem(action.payload);
      }),
      map(employee => new employeeActions.AddEmployeeSuccess(employee)),
      share()
    );

  @Effect() updateEmployee$ = this.actions$
    .pipe(
      ofType(employeeActions.UPDATE_EMPLOYEE),
      mergeMap((action: employeeActions.UpdateEmployee) => {
        return this.employeeService.updateItem(action.payload);
      }),
      map(employee => new employeeActions.UpdateEmployeeSuccess(employee)),
      share()
    );

  @Effect() deleteEmployee$ = this.actions$
    .pipe(
      ofType(employeeActions.DELETE_EMPLOYEE),
      mergeMap((action: employeeActions.DeleteEmployee) => {
        return this.employeeService.deleteItem(action.payload);
      }),
      map(employeeId => new employeeActions.DeleteEmployeeSuccess(employeeId)),
      share()
    );

  @Effect() changeStream$ = this.employeeService.getChangeStream()
    .pipe(
      filter((changes: any) => changes.indexOf('employee_') > -1),
      map(() => new employeeActions.LoadEmployees())
    );

  constructor(
    private actions$: Actions,
    private employeeService: EmployeeService
  ) {
  }
}
