import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-toggle-section',
  styleUrls: ['./toggleSection.component.scss'],
  template: `
  <div class="button-wrapper">
    <button mat-button (click)="onClick()">
      <mat-icon class="menu-icon" svgIcon="icon"></mat-icon>
      <span>{{section.name}}</span>
    </button>
    <mat-icon class="toggle-icon" svgIcon="toogleIcon"></mat-icon>
  </div>
  <nav>
    <ul [appToggleSection]="isOpen">
      <li *ngFor="let page of section.pages">
        <a mat-button [routerLink]="page.url" routerLinkActive="active">{{page.name}}</a>
      </li>
    </ul>
  </nav>
  `
})
export class ToggleSectionComponent implements OnInit {
  public isOpen: boolean;
  private _section: any;

  @Input()
  set section(section: any) {
    this._section = section;
    if (this.menuService.currentSection === this._section) {
      this.isOpen = true;
    }
  }

  get section(): any {
    return this._section;
  }

  constructor(
    private menuService: MenuService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) { }

  public ngOnInit() {
    // let subscription = this.menuService.eventStream$.subscribe(event => {
    //   this.isOpen = event.section === this.section;
    // });
    this.iconRegistry.addSvgIcon(
      'icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${this.section.icon}.svg`));
  }

  public onClick(): void {
    this.menuService.toggleSelectSection(this.section);
  }
}
