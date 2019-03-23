import { AbstractControl } from '@angular/forms';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ProductService } from 'src/app/core';

export class ProductValidator {

  static isUniqueBarcode(productService: ProductService, productId?: string) {
    return (control: AbstractControl) => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }

          return productService.getProductByBarcode(control.value)
            .pipe(
              map(product => {
                return product && product.id !== productId ? { 'takenBarcode': true } : null;
              })
            );
        })
      );
    };
  }

  static isUniqueSKU(productService: ProductService, productId?: string) {
    return (control: AbstractControl) => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }

          return productService.getProductBySKU(control.value)
            .pipe(
              map(product => {
                return product && product.id !== productId ? { 'takenSKU': true } : null;
              })
            );
        })
      );
    };
  }

}

