import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-link-menu',
  styleUrls: ['../common.scss'],
  template: `
    <a mat-button [routerLink]="section.url" routerLinkActive="active">
      <mat-icon class="menu-icon" svgIcon="icon"></mat-icon>
      <span *ngIf="showLabel">{{section.name}}</span>
    </a>
  `
})
export class LinkMenuComponent implements OnInit {
  @Input() section: any;
  @Input() showLabel: boolean;

  constructor(
    private menuService: MenuService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) { }

  public ngOnInit() {
    this.iconRegistry.addSvgIcon(
      'icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${this.section.icon}.svg`));
  }
}
