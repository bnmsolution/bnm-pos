import { Action } from '@ngrx/store';

export const LOAD_STORE = '[Store] Load store';
export const LOAD_STORE_SUCCESS = '[Store] Load store success';
export const UPDATE_STORE = '[Store] Update store';
export const UPDATE_STORE_SUCCESS = '[Store] Update store success';

export class LoadStores implements Action {
    readonly type = LOAD_STORE;
    constructor() { }
}

export class LoadStoresSuccess implements Action {
    readonly type = LOAD_STORE_SUCCESS;
    constructor(public payload: any) { }
}

export class UpdateStore implements Action {
    readonly type = UPDATE_STORE;
    constructor(public payload: any) { }
}

export class UpdateStoreSuccess implements Action {
    readonly type = UPDATE_STORE_SUCCESS;
    constructor(public payload: any) { }
}

export type StoresActions = LoadStores | LoadStoresSuccess |
UpdateStore | UpdateStoreSuccess;
