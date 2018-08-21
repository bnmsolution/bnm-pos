import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Product} from 'pos-models';

import {ProductService} from 'src/app/core';

@Injectable()
export class ProductResolverService {

  constructor(private productService: ProductService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const productId = route.paramMap.get('id');
    return this.productService.getProductById(productId);
  }
}

