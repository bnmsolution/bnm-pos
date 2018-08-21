import { Action } from '@ngrx/store';

export const LOAD_CATEGORIES = '[Category] Load categories';
export const LOAD_CATEGORIES_SUCCESS = '[Category] Load categories success';
export const ADD_CATEGORY = '[Category] Add category';
export const ADD_CATEGORY_SUCCESS = '[Category] Add category success';
export const UPDATE_CATEGORY = '[Category] Update category';
export const UPDATE_CATEGORY_SUCCESS = '[Category] Update category success';
export const DELETE_CATEGORY = '[Category] Delete category';
export const DELETE_CATEGORY_SUCCESS = '[Category] Delete category success';

export class LoadCategories implements Action {
  readonly type = LOAD_CATEGORIES;
  constructor() { }
}

export class LoadCategoriesSuccess implements Action {
  readonly type = LOAD_CATEGORIES_SUCCESS;
  constructor(public payload: any) { }
}

export class AddCategory implements Action {
  readonly type = ADD_CATEGORY;
  constructor(public payload: any) { }
}

export class AddCategorySuccess implements Action {
  readonly type = ADD_CATEGORY_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateCategory implements Action {
  readonly type = UPDATE_CATEGORY;
  constructor(public payload: any) { }
}

export class UpdateCategorySuccess implements Action {
  readonly type = UPDATE_CATEGORY_SUCCESS;
  constructor(public payload: any) { }
}

export class DeleteCategory implements Action {
  readonly type = DELETE_CATEGORY;
  constructor(public payload: any) { }
}

export class DeleteCategorySuccess implements Action {
  readonly type = DELETE_CATEGORY_SUCCESS;
  constructor(public payload: any) { }
}

export type CategoryActions = LoadCategories | LoadCategoriesSuccess |
  AddCategory | AddCategorySuccess | UpdateCategory |
  UpdateCategorySuccess | DeleteCategory | DeleteCategorySuccess;
