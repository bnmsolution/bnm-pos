import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuMode, MenuService } from '../services/menu.service';

@Component({
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
    <nav>
      <ul>
        <li *ngFor="let section of sections">
          <app-link-menu
            *ngIf="section.type === 'link'"
            [showLabel]="showLabel"
            [section]="section">
          </app-link-menu>
        </li>
      </ul>
    </nav>
  `
})
export class MenuComponent {
  sections: any[];
  showLabel = true;

  constructor(private router: Router, private menuService: MenuService) {
    this.sections = this.menuService.sections;
    this.menuService.menuMode$.subscribe((mode: MenuMode) => {
      this.showLabel = mode === MenuMode.Full;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('/register') !== -1) {
          this.sections = this.menuService.registerSections;
        } else {
          this.sections = this.menuService.sections;
        }
      }
    });
  }
}
