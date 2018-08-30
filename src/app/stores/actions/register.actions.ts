import { Action } from '@ngrx/store';

export const LOAD_REGISTERS = '[Register] Load registers';
export const LOAD_REGISTERS_SUCCESS = '[Register] Load registers success';
export const ADD_REGISTER = '[Register] Add register';
export const ADD_REGISTER_SUCCESS = '[Register] Add register success';
export const UPDATE_REGISTER = '[Register] Update register';
export const UPDATE_REGISTER_SUCCESS = '[Register] Update register success';
export const DELETE_REGISTER = '[Register] Delete register';
export const DELETE_REGISTER_SUCCESS = '[Register] Delete register success';

export class LoadRegisters implements Action {
  readonly type = LOAD_REGISTERS;
  constructor() { }
}

export class LoadRegistersSuccess implements Action {
  readonly type = LOAD_REGISTERS_SUCCESS;
  constructor(public payload: any) { }
}

export class AddRegister implements Action {
  readonly type = ADD_REGISTER;
  constructor(public payload: any) { }
}

export class AddRegisterSuccess implements Action {
  readonly type = ADD_REGISTER_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateRegister implements Action {
  readonly type = UPDATE_REGISTER;
  constructor(public payload: any) { }
}

export class UpdateRegisterSuccess implements Action {
  readonly type = UPDATE_REGISTER_SUCCESS;
  constructor(public payload: any) { }
}

export class DeleteRegister implements Action {
  readonly type = DELETE_REGISTER;
  constructor(public payload: any) { }
}

export class DeleteRegisterSuccess implements Action {
  readonly type = DELETE_REGISTER_SUCCESS;
  constructor(public payload: any) { }
}


export type RegisterActions = LoadRegisters | LoadRegistersSuccess |
  AddRegister | AddRegisterSuccess | UpdateRegister |
  UpdateRegisterSuccess | DeleteRegister | DeleteRegisterSuccess;
