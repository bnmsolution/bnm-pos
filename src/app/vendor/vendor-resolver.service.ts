import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Vendor} from 'pos-models';

import {VendorService} from '../core';

@Injectable()
export class VendorResolverService {

  constructor(private vendorService: VendorService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Vendor> {
    const vendorId = route.paramMap.get('id');
    return this.vendorService.getItemById(vendorId);
  }
}

