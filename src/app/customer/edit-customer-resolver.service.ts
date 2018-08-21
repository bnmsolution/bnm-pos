import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Customer} from 'pos-models';

import {CustomerService} from 'src/app/core';

@Injectable()
export class EditCustomerResolverService {

  constructor(private customerService: CustomerService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Customer> {
    const customerId = route.paramMap.get('id');
    return this.customerService.getItemById(customerId);
  }
}

