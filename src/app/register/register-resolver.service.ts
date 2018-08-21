import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Register} from 'pos-models';

import {RegisterService, RegisterSaleService} from '../core';

@Injectable()
export class RegisterResolverService implements Resolve<any> {

  constructor(private registerService: RegisterService, private registerSaleService: RegisterSaleService) {
  }

  public resolve() {
    // const promises: Promise<any>[] = [
    //   this.registerService.getAll(),
    //   this.registerSaleService.getAll()
    // ];

    // return Promise.all(promises)
    //   .then(results => {
    //     console.log('loaded');
    //     this.registerService.selectRegister(results[0][0]);
    //   });
  }
}
