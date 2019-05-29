import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MenuService } from 'src/app/core';

@Component({
  selector: 'app-create-content-footer',
  templateUrl: './create-content-footer.component.html',
  styleUrls: ['./create-content-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateContentFooterComponent {
  @Input() title: string;
  @Input() returnUrl: string;
  @Input() canSubmit: boolean;
  @Input() type: string;
  @Input() addButtonLabel: string;
  @Input() editButtonLabel: string;
}
