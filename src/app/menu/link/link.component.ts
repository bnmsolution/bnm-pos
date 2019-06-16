import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import {MenuMode, MenuService} from '../../services/menu.service';

@Component({
  selector: 'app-link-menu',
  templateUrl: './link.component.html',
  styleUrls: ['../common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkMenuComponent implements OnInit {
  @Input() section: any;
  @Input() showLabel: boolean;

  constructor(
    private menuService: MenuService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
  }

  public ngOnInit() {
    this.iconRegistry.addSvgIcon(
      'icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${this.section.icon}.svg`));
  }
}
