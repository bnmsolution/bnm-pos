import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { AppState } from '../services/app.service';


@Injectable()
export class SyncGuardService implements CanActivate {
  constructor(private router: Router, private appState: AppState) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.appState.isSynced) {
      return true;
    } else {
      this.router.navigate(['/sync'], {
        queryParams: {
          return: state.url
        }
      });
    }
  }
}
