import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {Employee} from 'pos-models';

import {CrudService} from './crudService';
import {HttpService} from './http.service';
import {LocalDbService} from './localDb.service';

const documentName = 'employee';

@Injectable()
export class EmployeeService extends CrudService {
  constructor(
    private httpService: HttpService,
    private localDbService: LocalDbService) {
    super(localDbService, httpService, documentName);
  }

  findEmployeeByEmail(email: string): Observable<Employee> {
    return this.getAll()
      .pipe(
        mergeMap(employees => {
          return of(employees.find(e => e.email === email));
        })
      );
  }

  findEmployeeByCode(code: string): Observable<Employee> {
    return this.getAll()
      .pipe(
        mergeMap(employees => {
          return of(employees.find(e => e.code === code));
        })
      );
  }
}
