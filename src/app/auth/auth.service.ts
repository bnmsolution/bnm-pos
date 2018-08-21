import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import * as auth0 from 'auth0-js';
import {BehaviorSubject} from 'rxjs';
import {Store} from '@ngrx/store';
import {Employee} from 'pos-models';

import {EmployeeService, LocalDbService} from 'src/app/core';

export interface UserProfile {
  name: string;
  tenantId: string;
  tenantName: string;
}

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'PMsjaHnyO5GtYPkFTe7nqHMqSMuAGvz5',
    domain: 'bmsolution.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.bnmpos.com',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile'
  });
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  masterUser: Employee;
  user: Employee;

  private _userProfile: UserProfile;

  constructor(private router: Router,
              private employeeService: EmployeeService,
              private localDbService: LocalDbService,
              private store: Store<any>) {
    if (this.authenticated) {
      this._userProfile = JSON.parse(localStorage.getItem('profile'));
      this.setLoggedIn(true);
    }
  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  get userProfile() {
    return Object.assign({}, this._userProfile);
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.getUserProfile(authResult);
      } else if (err) {
        console.error(`Error: ${err.error}`);
      }
    });
  }

  getUserProfile(authResult) {
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      const namespace = 'https://pos.bnmsolution.com/';
      const app_metadata = profile[namespace + 'app_metadata'];
      if (app_metadata) {
        profile.tenantId = app_metadata.tenantId;
      }
      this.setSession(authResult, profile);
    });
  }

  login(): void {
    this.auth0.authorize();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    this._userProfile = null;
    this.setLoggedIn(false);
  }

  private setLoggedIn(value: boolean) {
    console.log('[Auth service] User logged in');
    console.log(this._userProfile);
    this.loggedIn$.next(value);
    this.loggedIn = value;
    this.localDbService.init(this._userProfile.tenantId);
    this.localDbService.startLiveReplication(this._userProfile.tenantId);
    this.setCurrentUser();
  }

  private setCurrentUser() {
    const userCode = localStorage.getItem('user');
    this.onMasterUserLoggedIn(this._userProfile.name);
    this.employeeService.findEmployeeByCode(userCode)
      .subscribe(currentUser => {
        // this.store.dispatch(new salesListActions.LoginUser({ user: currentUser }));
        this.user = currentUser;
      });
  }

  private setSession(authResult, profile): void {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this._userProfile = profile;
    this.setLoggedIn(true);
    this.onMasterUserLoggedIn(this._userProfile.name, true);
  }

  private onMasterUserLoggedIn(email: string, isCurrentUser = false) {
    this.employeeService.findEmployeeByEmail(email)
      .subscribe(masterEmployee => {
        if (isCurrentUser) {
          localStorage.setItem('user', masterEmployee.code);
          this.setCurrentUser();
        }
        // this.store.dispatch(new salesListActions.LoginMasterUser({ user: masterEmployee }));
        this.masterUser = masterEmployee;
      });
  }
}
