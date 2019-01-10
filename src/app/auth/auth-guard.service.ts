import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';
import { AppState } from '../services/app.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private appState: AppState, private authService: AuthService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      if (this.appState.isSynced) {
        console.log(`[auth-guard] Authenticated`);
        return true;
      } else {
        this.router.navigate(['/sync'], {
          queryParams: {
            return: state.url
          }
        });
      }
    } else {
      console.log(`[auth-guard] Unauthenticated`);
      this.authService.login();
      return false;
    }
  }
}
