import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { RegisterSale, RegisterPayment, PaymentType, Customer } from 'pos-models';
import { getHours, getDay, getYear } from 'date-fns';

import * as salesListActions from '../../stores/actions/sales.actions';

@Component({
  selector: 'app-customer-quick-edit-dialog',
  templateUrl: './customer-quick-edit-dialog.component.html',
  styleUrls: ['./customer-quick-edit-dialog.component.scss']
})
export class CustomerQuickEditDialogComponent implements OnInit, OnDestroy {

  customer: Customer;
  ageGroups = [10, 20, 30, 40, 50, 60];
  subscription: Subscription;
  customerStats: any = {};
  lineChartData: any;
  salesByDayChartData: any;
  lineChartOptions: any;

  constructor(
    private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.customer = data;
  }

  ngOnInit() {
    this.subscription = this.store.select('sales')
      .subscribe(sales => {
        if (sales) {
          const salesByCustomer = sales.filter(s => s.customerId === this.customer.id);
          this.findFavorateProducts(salesByCustomer);
        } else {
          this.store.dispatch(new salesListActions.LoadSales());
        }
      });

    this.calcCustomerAgeGroup();
    console.log(this.customer);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  findFavorateProducts(sales: RegisterSale[]) {
    let cashPaidTotal = 0;
    let creditCardPaidTotal = 0;
    const lineItemCount = {};
    const salesCountByHour = {};
    const salesCountByDay = Array(7).fill(0);

    sales.forEach(s => {
      cashPaidTotal += this.getTotalPaymentByType(s.payments, PaymentType.Cash);
      creditCardPaidTotal += this.getTotalPaymentByType(s.payments, PaymentType.CreditCard);

      s.lineItems.forEach(l => {
        const id = l.variantId || l.productId;
        if (lineItemCount[id]) {
          lineItemCount[id].count++;
        } else {
          lineItemCount[id] = {
            count: 1,
            name: l.name
          };
        }
      });

      const saleDate = new Date(s.salesDate);
      const saleHour = getHours(saleDate);
      const saleDay = getDay(saleDate);

      if (salesCountByHour[saleHour]) {
        salesCountByHour[saleHour]++;
      } else {
        salesCountByHour[saleHour] = 1;
      }

      salesCountByDay[saleDay]++;
    });

    const totalPaid = cashPaidTotal + creditCardPaidTotal;
    const cashRate = Math.round((cashPaidTotal / totalPaid) * 100);
    const creditCardRate = 100 - cashRate;


    this.customerStats = {
      cash: cashRate,
      credit: creditCardRate,
      topProducts: Object.keys(lineItemCount).map(key => lineItemCount[key]).sort((a, b) => b.count - a.count).splice(0, 5),
      salesCountByHour: Object.keys(salesCountByHour).map(key => {
        return { hour: parseInt(key, 10), count: salesCountByHour[key] };
      }).sort((a, b) => a.hour - b.hour)
    };

    console.log(this.customerStats);


    this.lineChartData = {
      labels: this.customerStats.salesCountByHour.map(d => d.hour),
      datasets: [{
        label: 'test',
        data: this.customerStats.salesCountByHour.map(d => d.count),
        borderWidth: 1
      }]
    };

    this.salesByDayChartData = {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [{
        label: 'test',
        data: salesCountByDay,
        borderWidth: 1
      }]
    };

    this.lineChartOptions = {
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }]
      },
      plugins: {
        datalabels: {
          display: false
        }
      }
    };
  }

  getTotalPaymentByType(payments: RegisterPayment[], paymentType: PaymentType): number {
    return payments
      .filter(p => p.paymentType === paymentType)
      .map(p => p.amount)
      .reduce((acc, cur) => acc + cur, 0);
  }



  calcCustomerAgeGroup() {
    if (this.customer.dateOfBirth) {
      const yearToday = getYear(new Date());
      const yearAtBirth = getYear(new Date(this.customer.dateOfBirth));
      this.customer.ageGroup = Math.floor((yearToday - yearAtBirth) / 10) * 10;
    }
  }

}
