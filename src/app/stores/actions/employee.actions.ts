import { Action } from '@ngrx/store';

export const LOAD_EMPLOYEES = '[Employee] Load employees';
export const LOAD_EMPLOYEES_SUCCESS = '[Employee] Load employees success';
export const ADD_EMPLOYEE = '[Employee] Add employee';
export const ADD_EMPLOYEE_SUCCESS = '[Employee] Add employee success';
export const UPDATE_EMPLOYEE = '[Employee] Update employee';
export const UPDATE_EMPLOYEE_SUCCESS = '[Employee] Update employee success';
export const DELETE_EMPLOYEE = '[Employee] Delete employee';
export const DELETE_EMPLOYEE_SUCCESS = '[Employee] Delete employee success';

export class LoadEmployees implements Action {
  readonly type = LOAD_EMPLOYEES;
  constructor() { }
}

export class LoadEmployeesSuccess implements Action {
  readonly type = LOAD_EMPLOYEES_SUCCESS;
  constructor(public payload: any) { }
}

export class AddEmployee implements Action {
  readonly type = ADD_EMPLOYEE;
  constructor(public payload: any) { }
}

export class AddEmployeeSuccess implements Action {
  readonly type = ADD_EMPLOYEE_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateEmployee implements Action {
  readonly type = UPDATE_EMPLOYEE;
  constructor(public payload: any) { }
}

export class UpdateEmployeeSuccess implements Action {
  readonly type = UPDATE_EMPLOYEE_SUCCESS;
  constructor(public payload: any) { }
}

export class DeleteEmployee implements Action {
  readonly type = DELETE_EMPLOYEE;
  constructor(public payload: any) { }
}

export class DeleteEmployeeSuccess implements Action {
  readonly type = DELETE_EMPLOYEE_SUCCESS;
  constructor(public payload: any) { }
}

export type EmployeeActions = LoadEmployees | LoadEmployeesSuccess |
  AddEmployee | AddEmployeeSuccess | UpdateEmployee |
  UpdateEmployeeSuccess | DeleteEmployee | DeleteEmployeeSuccess;
