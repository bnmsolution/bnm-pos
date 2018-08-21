import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {MenuService} from '../services/menu.service';

@Component({
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
    <nav>
      <ul>
        <li *ngFor="let section of sections">
          <app-toggle-section
            *ngIf="section.type === 'toggle'"
            [section]="section">
          </app-toggle-section>
          <app-link-menu
            *ngIf="section.type === 'link'"
            [section]="section">
          </app-link-menu>
        </li>
      </ul>
    </nav>
  `
})
export class MenuComponent {
  public sections: any[];

  constructor(private router: Router, private menuService: MenuService) {
    this.sections = this.menuService.sections;
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
