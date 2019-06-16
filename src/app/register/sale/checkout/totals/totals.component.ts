import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterSale } from 'pos-models';
import { DiscountDialogComponent } from '../discount-dialog/discount-dialog.component';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsComponent {
  @Input() sale: RegisterSale;

  constructor(private dialog: MatDialog) {
  }

  openDiscountDialog() {
    this.dialog.open(DiscountDialogComponent, {
      autoFocus: false
    });
  }


  get origianlTotal(): number {
    let total = 0;
    this.sale.lineItems.forEach(li => {
      const lineTotal = (li.originalPrice + li.addons.map(a => a.price).reduce((a, b) => a + b, 0)) * li.quantity;
      total += lineTotal;
    });
    return total;
  }
}
