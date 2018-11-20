import {Injectable} from '@angular/core';

import {HttpService} from './http.service';

@Injectable()
export class ImportService {
  constructor(
    private httpService: HttpService) {
  }

  importProducts(data) {
    return this.httpService.post('import/products', data);
  }
}
