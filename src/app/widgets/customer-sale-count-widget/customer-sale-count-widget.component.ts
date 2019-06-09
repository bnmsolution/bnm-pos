import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { isWithinInterval } from 'date-fns';
import { RegisterSale, getChangeRateData } from 'pos-models';

@Component({
  selector: 'app-customer-sale-count-widget',
  templateUrl: './customer-sale-count-widget.component.html',
  styleUrls: ['./customer-sale-count-widget.component.scss']
})
export class CustomerSaleCountWidgetComponent implements OnInit, OnChanges {
  @Input() summary: any;

  returnCustomerSalesCount = 0;
  displayData;

  ngOnInit() {
  }

  ngOnChanges() {
    this.setReturnCustomerCount();
  }

  setReturnCustomerCount() {
    const { startDate, endDate, prevStartDate, prevEndDate } = this.summary.dates;
    const currentPeriod = { start: new Date(startDate), end: new Date(endDate) };
    const prevPeriod = { start: new Date(prevStartDate), end: new Date(prevEndDate) };
    this.returnCustomerSalesCount = this.summary.salesInCurrentPeriod.filter((s: RegisterSale) =>
      isWithinInterval(new Date(s.salesDate), currentPeriod) && s.customerId).length;
    const previousCount = this.summary.salesInPreviousPeriod.filter((s: RegisterSale) =>
      isWithinInterval(new Date(s.salesDate), prevPeriod) && s.customerId).length;
    this.displayData = getChangeRateData(this.returnCustomerSalesCount, previousCount);
  }

}
