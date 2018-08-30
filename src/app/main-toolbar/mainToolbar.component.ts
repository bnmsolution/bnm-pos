import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

import {AuthService} from '../auth';
import {MenuService} from '../services/menu.service';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './mainToolbar.component.html',
  styleUrls: ['./mainToolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {

  public url: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private menuService: MenuService) {
  }

  ngOnInit() {
    this.url = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  toggleMenuMode() {
    this.menuService.toggleMenuMode();
  }

  logout() {
    this.authService.logout();
  }
}
