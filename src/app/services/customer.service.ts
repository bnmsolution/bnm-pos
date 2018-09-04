import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Customer} from 'pos-models';

import {CrudService} from './crudService';
import {HttpService} from './http.service';
import {LocalDbService} from './localDb.service';

const documentName = 'customer';

@Injectable()
export class CustomerService extends CrudService {
  constructor(
    private httpService: HttpService,
    private localDbService: LocalDbService) {
    super(localDbService, httpService, documentName);
  }

  isUniquePhoneNumber(phoneNumber: string): Observable<boolean> {
    return this.getAll()
      .pipe(
        map((customers: Customer[]) => {
          return customers.find(c => c.phone.trim() === phoneNumber.trim()) === undefined;
        })
      );
  }
}
