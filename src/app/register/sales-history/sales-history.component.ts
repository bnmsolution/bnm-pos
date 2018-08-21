import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {RegisterSale} from 'pos-models';

import {RegisterSaleService} from 'src/app/core';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.scss']
})
export class SalesHistoryComponent implements OnInit {
  public sales: RegisterSale[];
  public subscription: Subscription;
  public openedDetailIndex = -1;

  constructor(private registerSaleService: RegisterSaleService) {
    // this.subscription = this.registerSaleService.dataStream$
    //   .subscribe(sales => {
    //     this.sales = sales;
    //   });
    // this.registerSaleService.loadAll();
  }

  ngOnInit() {
  }

  public openDetail(index: number) {
    this.openedDetailIndex = this.openedDetailIndex === index ? -1 : index;
  }

}
