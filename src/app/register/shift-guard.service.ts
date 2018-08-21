import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { RegisterService } from '../core';


@Injectable()
export class ShiftGuardService implements CanActivate {
  constructor(private router: Router, private registerService: RegisterService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkShift();
  }

  private checkShift(): boolean {
    // if (this.registerService.isShiftOpened()) { return true; }
    // this.router.navigate(['/open-shift']);
    return false;
  }
}
