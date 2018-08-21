import {Injectable} from '@angular/core';
import {Observable, forkJoin, from} from 'rxjs';
import {map} from 'rxjs/operators';
import {Product} from 'pos-models';

import {CrudService} from './crudService';
import {HttpService} from './http.service';
import {LocalDbService} from './localDb.service';

const documentName = 'product';

@Injectable()
export class ProductService extends CrudService {
  constructor(
    private httpService: HttpService,
    private localDbService: LocalDbService) {
    super(localDbService, httpService, documentName);
  }

  getAllProducts(): Observable<Product[]> {
      return forkJoin(
        this.localDbService.findAllDocs('product'),
        this.localDbService.findAllDocs('category'),
        this.localDbService.findAllDocs('vendor'),
        this.localDbService.findAllDocs('tax')
      ).pipe(
        map(([products, categories, vendors, taxes]: [any, any, any, any]) => {
          return products.map(p => {
            if (p.categoryId) {
              p.category = categories.find(c => c.id === p.categoryId);
            }
            if (p.vendorId) {
              p.vendor = vendors.find(v => v.id === p.vendorId);
            }
            if (p.taxId) {
              p.tax = taxes.find(t => t.id === p.taxId);
            }
            return p;
          });
        })
      );
  }

  getProductById(productId: string): Observable<Product> {
    const promise = this.localDbService.get('product', productId)
      .then(p => {
        return Promise.all([
          this.localDbService.get('category', p.categoryId),
          this.localDbService.get('vendor', p.vendorId),
          this.localDbService.get('tax', p.taxId)
        ])
          .then(([category, vendor, tax]) => {
            p.category = category;
            p.vendor = vendor;
            p.tax = tax;
            return p;
          });
      });
    return from(promise);
  }
}
