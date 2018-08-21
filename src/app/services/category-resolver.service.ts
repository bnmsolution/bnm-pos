import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, tap, take} from 'rxjs/operators';
import {Category} from 'pos-models';

import * as CategoryActions from 'src/app/stores/actions/category.actions';

@Injectable()
export class CategoryResolverService {

  constructor(private store: Store<any>) {
  }

  public resolve(): Observable<Category[]> {
    return this.store.select('categories')
      .pipe(
        tap(categories => {
          if (!categories) {
            this.store.dispatch(new CategoryActions.LoadCategories());
          }
        }),
        filter(categories => categories),
        take(1)
      );
  }
}

