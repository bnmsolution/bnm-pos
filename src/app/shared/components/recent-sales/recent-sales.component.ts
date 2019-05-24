import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { RegisterSale } from 'pos-models';
import { isSameDay } from 'date-fns';

import format from '../../utils/format';

@Component({
  selector: 'app-recent-sales',
  templateUrl: './recent-sales.component.html',
  styleUrls: ['./recent-sales.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentSalesComponent implements OnInit {
  @Input() sales: RegisterSale[];

  ngOnInit() {
  }

  getDateString(sale: RegisterSale): string {
    const salesDate = new Date(sale.salesDate);
    if (isSameDay(salesDate, new Date())) {
      return format(salesDate, 'hh:mm a');
    } else {
      return format(salesDate, 'MM.dd iiiii');
    }
  }
}
