import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {share, mergeMap, map, filter} from 'rxjs/operators';

import * as productActions from '../actions/product.actions';
import {ProductService} from 'src/app/core';

@Injectable()
export class ProductEffects {

  @Effect() getProducts$ = this.actions$
    .pipe(
      ofType(productActions.LOAD_PRODUCTS),
      mergeMap(() => this.productService.getAllProducts()),
      map(products => new productActions.LoadProductsSuccess(products))
    );

  @Effect() addProduct$ = this.actions$
    .pipe(
      ofType(productActions.ADD_PRODUCT),
      mergeMap((action: productActions.AddProduct) => {
        return this.productService.addItem(action.payload);
      }),
      map(product => new productActions.AddProductSuccess(product)),
      share()
    );

  @Effect() updateProduct$ = this.actions$
    .pipe(
      ofType(productActions.UPDATE_PRODUCT),
      mergeMap((action: productActions.UpdateProduct) => {
        return this.productService.updateItem(action.payload);
      }),
      map(product => new productActions.UpdateProductSuccess(product)),
      share()
    );

  @Effect() changeStream$ = this.productService.getChangeStream()
    .pipe(
      filter((changes: any) => changes.indexOf('product_') > -1),
      map(() => new productActions.LoadProducts())
    );

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {
  }
}
