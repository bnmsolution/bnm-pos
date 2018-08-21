import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {share, mergeMap, map, filter} from 'rxjs/operators';

import * as employeeActions from '../actions/employee.actions';
import {EmployeeService} from 'src/app/core';

@Injectable()
export class EmployeeEffects {

  @Effect() getEmployees$ = this.actions$
    .ofType(employeeActions.LOAD_EMPLOYEES)
    .pipe(
      mergeMap((action: employeeActions.LoadEmployees) => {
        return this.employeeService.getAll();
      }),
      map(categories => new employeeActions.LoadEmployeesSuccess(categories))
    );


  @Effect() addEmployee$ = this.actions$
    .ofType(employeeActions.ADD_EMPLOYEE)
    .pipe(
      mergeMap((action: employeeActions.AddEmployee) => {
        return this.employeeService.addItem(action.payload);
      }),
      map(employee => new employeeActions.AddEmployeeSuccess(employee)),
      share()
    );

  @Effect() updateEmployee$ = this.actions$
    .ofType(employeeActions.UPDATE_EMPLOYEE)
    .pipe(
      mergeMap((action: employeeActions.UpdateEmployee) => {
        return this.employeeService.updateItem(action.payload);
      }),
      map(employee => new employeeActions.UpdateEmployeeSuccess(employee)),
      share()
    );

  @Effect() deleteEmployee$ = this.actions$
    .ofType(employeeActions.DELETE_EMPLOYEE)
    .pipe(
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
