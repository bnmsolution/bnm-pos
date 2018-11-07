
import {Injectable} from '@angular/core';
import {Observable, forkJoin, from, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Product, Category, Vendor, Tax} from 'pos-models';

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
      this.localDbService.findAllDocs('tax'),
      this.localDbService.findAllDocs('inventory')
    ).pipe(
      map(([products, categories, vendors, taxes, inventories]: [any, any, any, any, any]) => {
        return products.map(p => {
          // todo: create map to reduce time
          if (p.categoryId) {
            p.category = categories.find(c => c.id === p.categoryId);
          }
          if (p.vendorId) {
            p.vendor = vendors.find(v => v.id === p.vendorId);
          }
          if (p.taxId) {
            p.tax = taxes.find(t => t.id === p.taxId);
          }
          p.inventory = inventories.find(i => i.productId === p.id);
          return p;
        });
      })
    );
  }

  getProductById(productId: string): Observable<Product> {
    return this.localDbService.get('product', productId)
      .pipe(
        switchMap((p: Product) => forkJoin(
          of(p),
          this.localDbService.get('category', p.categoryId),
          this.localDbService.get('vendor', p.vendorId),
          this.localDbService.get('tax', p.taxId),
        )),
        map(([product, category, vendor, tax]) => {
          product.category = category;
          product.vendor = vendor;
          product.tax = tax;
          return product;
        })
      );
  }

  getProductWithInventoryTransaction(productId: string): Observable<any> {
    return forkJoin(
      this.localDbService.get('product', productId),
      this.localDbService.get('inventory', productId),
      this.localDbService.findAllDocs(`inventoryTransaction_${productId}`)
    ).pipe(
      map(([product, inventory, inventoryTransactions]: [any, any, any]) => {
        product.inventory = inventory;
        product.inventoryTransactions = inventoryTransactions;
        return product;
      })
    );
  }
}
