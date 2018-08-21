import { Action } from '@ngrx/store';

export const LOAD_VENDORS = '[Vendor] Load vendors';
export const LOAD_VENDORS_SUCCESS = '[Vendor] Load vendors success';
export const ADD_VENDOR = '[Vendor] Add vendor';
export const ADD_VENDOR_SUCCESS = '[Vendor] Add vendor success';
export const UPDATE_VENDOR = '[Vendor] Update vendor';
export const UPDATE_VENDOR_SUCCESS = '[Vendor] Update vendor success';
export const DELETE_VENDOR = '[Vendor] Delete vendor';
export const DELETE_VENDOR_SUCCESS = '[Vendor] Delete vendor success';

export class LoadVendors implements Action {
  readonly type = LOAD_VENDORS;
  constructor() { }
}

export class LoadVendorsSuccess implements Action {
  readonly type = LOAD_VENDORS_SUCCESS;
  constructor(public payload: any) { }
}

export class AddVendor implements Action {
  readonly type = ADD_VENDOR;
  constructor(public payload: any) { }
}

export class AddVendorSuccess implements Action {
  readonly type = ADD_VENDOR_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateVendor implements Action {
  readonly type = UPDATE_VENDOR;
  constructor(public payload: any) { }
}

export class UpdateVendorSuccess implements Action {
  readonly type = UPDATE_VENDOR_SUCCESS;
  constructor(public payload: any) { }
}

export class DeleteVendor implements Action {
  readonly type = DELETE_VENDOR;
  constructor(public payload: any) { }
}

export class DeleteVendorSuccess implements Action {
  readonly type = DELETE_VENDOR_SUCCESS;
  constructor(public payload: any) { }
}

export type VendorActions = LoadVendors | LoadVendorsSuccess |
  AddVendor | AddVendorSuccess | UpdateVendor |
  UpdateVendorSuccess | DeleteVendor | DeleteVendorSuccess;
