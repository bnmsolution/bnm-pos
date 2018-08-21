import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from '../auth';
import { AppState } from '../services/app.service';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './mainToolbar.component.html',
  styleUrls: ['./mainToolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {

  public url: string;

  constructor(private router: Router, private authService: AuthService, private appState: AppState) {
  }

  public ngOnInit() {
    this.url = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  public getMainPath(): string {
    if (this.url !== '/') {
      const paths = this.url.split('/');
      return paths[1];
    }
  }

  public getSubPath(): string {
    if (this.url !== '/') {
      const paths = this.url.split('/');
      return paths[2];
    }
  }

  public login(): void {
    // this.authService.login();
  }

  public logout(): void {
    this.authService.logout();
  }
}
