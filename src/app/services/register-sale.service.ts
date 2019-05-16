import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { RegisterSale } from 'pos-models';
import * as stringWidth from 'string-width';


import { CrudService } from './crudService';
import { HttpService } from './http.service';
import { LocalDbService } from './localDb.service';
import { map } from 'rxjs/operators';
import { MessageService } from './message.service';

const documentName = 'registerSale';

@Injectable()
export class RegisterSaleService extends CrudService {

  constructor(
    private httpService: HttpService,
    private localDbService: LocalDbService,
    private messageService: MessageService) {
    super(localDbService, httpService, documentName);
  }

  getAllSales(): Observable<RegisterSale[]> {
    return forkJoin(
      this.localDbService.findAllDocs('registerSale'),
      this.localDbService.findAllDocs('customer'),
      this.localDbService.findAllDocs('employee'),
    ).pipe(
      map(([sales, customers, employees]: [any, any, any]) => {
        return sales.map(s => {
          if (s.customerId) {
            s.customer = customers.find(c => c.id === s.customerId);
          }
          if (s.userId) {
            s.user = employees.find(e => e.id === s.userId);
          }
          return s;
        });
      })
    );
  }

  closeSale(sale: RegisterSale): Observable<any> {
    return this.httpService.post('registerSale/close', sale);
  }

  holdSale(sale: RegisterSale): Observable<any> {
    return this.httpService.post('registerSale', sale);
  }
}
