import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Customer} from 'pos-models';
import * as randomColor from 'randomcolor';

@Component({
  selector: 'app-customer-view-dialog',
  templateUrl: './customer-view-dialog.component.html',
  styleUrls: ['./customer-view-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerViewDialogComponent {
  customer: Customer;
  background: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.customer = data.customer;
    this.background = randomColor({luminosity: 'dark'});
  }
}
