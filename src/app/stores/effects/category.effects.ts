import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {share, mergeMap, map, filter} from 'rxjs/operators';

import * as categoryActions from '../actions/category.actions';
import {CategoryService} from 'src/app/core';

@Injectable()
export class CategoryEffects {

  @Effect() getCategories$ = this.actions$
    .pipe(
      ofType(categoryActions.LOAD_CATEGORIES),
      mergeMap((action: categoryActions.LoadCategories) => {
        return this.categoryService.getAllCategories();
      }),
      map(categories => new categoryActions.LoadCategoriesSuccess(categories))
    );


  @Effect() addCategory$ = this.actions$
    .pipe(
      ofType(categoryActions.ADD_CATEGORY),
      mergeMap((action: categoryActions.AddCategory) => {
        return this.categoryService.addItem(action.payload);
      }),
      map(category => new categoryActions.AddCategorySuccess(category)),
      share()
    );

  // injecting effect and subscribing effect observable sequance will fire service call twice
  // @Effect decorator subscribes observable sequance automatically
  @Effect() updateCategory$ = this.actions$
    .pipe(
      ofType(categoryActions.UPDATE_CATEGORY),
      mergeMap((action: categoryActions.UpdateCategory) => {
        return this.categoryService.updateItem(action.payload);
      }),
      map(category => new categoryActions.UpdateCategorySuccess(category)),
      share()
    );

  @Effect() deleteCategory$ = this.actions$
    .pipe(
      ofType(categoryActions.DELETE_CATEGORY),
      mergeMap((action: categoryActions.DeleteCategory) => {
        return this.categoryService.deleteItem(action.payload);
      }),
      map(categoryId => new categoryActions.DeleteCategorySuccess(categoryId)),
      share()
    );

  @Effect() changeStream$ = this.categoryService.getChangeStream()
    .pipe(
      filter((changes: any) => changes.indexOf('category_') > -1),
      map(() => new categoryActions.LoadCategories())
    );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService
  ) {
  }
}
