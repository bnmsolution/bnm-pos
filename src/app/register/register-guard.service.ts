import {Injectable} from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {RegisterService} from '../core';

@Injectable()
export class RegisterGuardService {

  constructor(private router: Router, private registerService: RegisterService) {
  }

  // public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   // todo: register selection
  //   if (!this.registerService.currentReigster) {
  //     return fromPromise(this.registerService.getAll()
  //       .then(registers => {
  //         this.registerService.selectRegister(registers[0]);
  //         return true;
  //       }));
  //   } else {
  //     return Observable.of(true);
  //   }
  // }
}
