import { Action } from '@ngrx/store';

export const LOAD_SETTINGS = '[Setting] Load settings';
export const LOAD_SETTINGS_SUCCESS = '[Setting] Load settings success';
export const UPDATE_SETTINGS = '[Setting] Update settings';
export const UPDATE_SETTINGS_SUCCESS = '[Setting] Update settings success';

export class LoadSettings implements Action {
    readonly type = LOAD_SETTINGS;
    constructor() { }
}

export class LoadSettingsSuccess implements Action {
    readonly type = LOAD_SETTINGS_SUCCESS;
    constructor(public payload: any) { }
}

export class UpdateSettings implements Action {
    readonly type = UPDATE_SETTINGS;
    constructor(public payload: any) { }
}

export class UpdateSettingsSuccess implements Action {
    readonly type = UPDATE_SETTINGS_SUCCESS;
    constructor(public payload: any) { }
}

export type SettingsActions = LoadSettings | LoadSettingsSuccess |
UpdateSettings | UpdateSettingsSuccess;
