import {Injectable} from '@angular/core';
import {Observable, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {Vendor} from 'pos-models';

import {CrudService} from './crudService';
import {HttpService} from './http.service';
import {LocalDbService} from './localDb.service';

const documentName = 'vendor';

@Injectable()
export class VendorService extends CrudService {
  constructor(
    private httpService: HttpService,
    private localDbService: LocalDbService) {
    super(localDbService, httpService, documentName);
  }

  getAllVendors(): Observable<Vendor[]> {
    return forkJoin(
      this.localDbService.findAllDocs('vendor'),
      this.localDbService.findAllDocs('product')
    ).pipe(
      map(([vendors, products]: [any, any]) => {
        return vendors.map(v => {
          v.numberOfProducts = products.filter(p => p.vendorId === v.id).length;
          return v;
        });
      })
    );
  }
}

