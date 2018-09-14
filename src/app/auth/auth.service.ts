import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription, timer} from 'rxjs';
import * as auth0 from 'auth0-js';
import {BehaviorSubject} from 'rxjs';
import {Employee} from 'pos-models';

export interface UserProfile {
  name: string;
  tenantId: string;
  tenantName: string;
}

@Injectable()
export class AuthService {

  refreshSubscription: Subscription;
  auth0 = new auth0.WebAuth({
    clientID: 'PMsjaHnyO5GtYPkFTe7nqHMqSMuAGvz5',
    domain: 'bmsolution.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.bnmpos.com',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile'
  });
  profile$: BehaviorSubject<any>;

  constructor(private router: Router) {
    const profile = localStorage.getItem('profile');
    this.profile$ = new BehaviorSubject<UserProfile>(profile ? JSON.parse(profile) : null);
    this.scheduleRenewal();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.getProfile()
          .then(() => this.router.navigate(['/']));
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private getProfile(): Promise<any> {
    return new Promise(resolve => {
      const accessToken = localStorage.getItem('access_token');
      this.auth0.client.userInfo(accessToken, (err, profile) => {
        const namespace = 'https://pos.bnmsolution.com/';
        const app_metadata = profile[namespace + 'app_metadata'];
        if (app_metadata) {
          profile.tenantId = app_metadata.tenantId;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        this.profile$.next(profile);
        resolve();
      });
    });
  }

  private renewToken() {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.setSession(result);
      }
    });
  }

  private scheduleRenewal() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.unscheduleRenewal();

    const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));
    const now = Date.now();
    const time = Math.max(1000, expiresAt - now);

    console.log(`[AuthService] Renewal token after ${time}ms`);
    this.refreshSubscription = timer(time)
      .subscribe(() => {
          this.renewToken();
          this.scheduleRenewal();
        }
      );
  }

  private unscheduleRenewal() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  login(): void {
    this.auth0.authorize();
  }

  logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    this.unscheduleRenewal();
    this.auth0.authorize();
  }

  isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }


  private setSession(authResult): void {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.scheduleRenewal();
  }
}

