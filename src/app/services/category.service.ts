import {Injectable} from '@angular/core';
import {Observable, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {Category} from 'pos-models';

import {CrudService} from './crudService';
import {HttpService} from './http.service';
import {LocalDbService} from './localDb.service';

const documentName = 'category';

@Injectable()
export class CategoryService extends CrudService {
  constructor(
    private httpService: HttpService,
    private localDbService: LocalDbService) {
    super(localDbService, httpService, documentName);
  }

  getAllCategories(): Observable<Category[]> {
    return forkJoin(
      this.localDbService.findAllDocs('category'),
      this.localDbService.findAllDocs('product')
    ).pipe(
      map(([categories, products]: [any, any]) => {
        return categories.map(c => {
          c.numberOfProducts = products.filter(p => p.categoryId === c.id).length;
          return c;
        });
      })
    );
  }
}
