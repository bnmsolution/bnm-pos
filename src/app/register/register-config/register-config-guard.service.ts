import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { RegisterService } from '../../core';


@Injectable()
export class RegisterConfigGuardService implements CanActivate {
  constructor(private router: Router, private registerService: RegisterService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checKRegister();
  }

  private checKRegister(): boolean {
    // if (this.registerService.currentReigster) { return true; }
    // this.router.navigate(['/register']);
    return false;
  }
}
