import {Injectable} from '@angular/core';

import {CrudService} from './crudService';
import {HttpService} from './http.service';
import {LocalDbService} from './localDb.service';

const documentName = 'settings';

@Injectable()
export class SettingsService extends CrudService {
  constructor(
    private httpService: HttpService,
    private localDbService: LocalDbService) {
    super(localDbService, httpService, documentName);
  }
}
