import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MenuService } from 'src/app/core';

@Component({
  selector: 'app-create-content-header',
  templateUrl: './create-content-header.component.html',
  styleUrls: ['./create-content-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateContentHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() returnUrl: string;
  @Input() canSubmit: boolean;
  @Input() type: string;
  @Input() addButtonLabel: string;
  @Input() editButtonLabel: string;

  constructor(
    private menuService: MenuService) {
  }

  ngOnInit() {
  }

  toggleMenuMode() {
    this.menuService.toggleMenuMode();
  }
}
