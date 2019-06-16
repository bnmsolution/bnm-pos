import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import * as auth0 from 'auth0-js';

import { environment } from '../../environments/environment';

export interface UserProfile {
  name: string;
  tenantId: string;
  tenantName: string;
}

@Injectable()
export class AuthService {

  refreshSubscription: Subscription;
  auth0 = new auth0.WebAuth({
    clientID: environment.auth0.clientID,
    domain: environment.auth0.domain,
    responseType: 'token id_token',
    audience: environment.auth0.audience,
    redirectUri: `${window.location.origin}/callback`,
    scope: 'openid profile'
  });
  profile$: BehaviorSubject<any>;

  timerWoker: Worker;

  constructor(private router: Router) {
    const profile = localStorage.getItem('profile');
    this.profile$ = new BehaviorSubject<UserProfile>(profile ? JSON.parse(profile) : null);
    this.timerWoker = new Worker('assets/scripts/timer-worker.js');
    this.timerWoker.onmessage = eventMessage => {
      this.renewToken();
      this.scheduleRenewal();
    };
    this.scheduleRenewal();
  }

  handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.setSession(authResult);
        this.setProfile(authResult.idTokenPayload);
        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private setProfile(profile) {
    const namespace = environment.auth0.namespace;
    const appMetadata = profile[namespace + 'app_metadata'];
    if (appMetadata) {
      profile.tenantId = appMetadata.tenantId;
    }
    localStorage.setItem('profile', JSON.stringify(profile));
    this.profile$.next(profile);
  }

  renewToken() {
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
    // this.unscheduleRenewal();

    const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));
    const now = Date.now();
    const time = Math.max(1000, expiresAt - 3600000 - now);

    console.log(`[AuthService] Renewal token after ${time / 60000} minutes`);
    this.timerWoker.postMessage({
      method: 'registerTimer',
      args: ['renewal_token', time]
    });
  }

  private unscheduleRenewal() {
    this.timerWoker.postMessage({
      method: 'unregisterTimer',
      args: ['renewal_token']
    });
  }

  login(): void {
    this.auth0.authorize();
  }

  logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    this.unscheduleRenewal();

    // redirect to auth0 login page
    this.auth0.authorize();
  }

  isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }


  private setSession(authResult): void {
    console.log('Setting new session');
    const expTime = authResult.expiresIn * 1000 + Date.now();
    console.log('expire at: ' + new Date(expTime).toString());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.scheduleRenewal();
  }
}

