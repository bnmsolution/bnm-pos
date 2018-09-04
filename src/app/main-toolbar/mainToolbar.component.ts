import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {PosStore} from 'pos-models';

import {AuthService} from '../auth';
import {MenuService} from '../services/menu.service';
import {AppState} from '../services/app.service';


@Component({
  selector: 'app-main-toolbar',
  templateUrl: './mainToolbar.component.html',
  styleUrls: ['./mainToolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {

  settings: PosStore;
  user: any;
  unsubscribe$ = new Subject();

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private appState: AppState) {
  }

  ngOnInit() {
    this.appState.appState$.subscribe(state => {
      this.settings = state.settings;
      this.user = state.user;
    });
  }


  toggleMenuMode() {
    this.menuService.toggleMenuMode();
  }

  logout() {
    this.authService.logout();
  }
}
