import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {CrudService} from './crudService';
import {HttpService} from './http.service';
import {LocalDbService} from './localDb.service';

const documentName = 'register';

@Injectable()
export class RegisterService extends CrudService {
  constructor(
    private httpService: HttpService,
    private localDbService: LocalDbService) {
    super(localDbService, httpService, documentName);
  }

  getAll(): Observable<any[]> {
    return this.localDbService.findAllDocs(documentName)
      .pipe(
        map(register => {
          console.log(register);
          return register;
        })
      );
  }
}
