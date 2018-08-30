import { Action } from '@ngrx/store';

export const LOGIN_MASTER_USER = '[User] Login master user';
export const LOGOUT_MASTER_USER = '[Sale] Logout master user';
export const LOGIN_USER = '[User] Login user';
export const LOGOUT_USER = '[Sale] Logout user';

export class LoginMasterUser implements Action {
  readonly type = LOGIN_MASTER_USER;
  constructor(public payload: { user }) { }
}

export class LogOutMasterUser implements Action {
  readonly type = LOGIN_MASTER_USER;
  constructor(public payload: {}) { }
}

export class LoginUser implements Action {
  readonly type = LOGIN_USER;
  constructor(public payload: { user }) { }
}

export class LogOutUser implements Action {
  readonly type = LOGOUT_USER;
  constructor(public payload: {}) { }
}
