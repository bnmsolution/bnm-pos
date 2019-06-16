import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { RegisterSale, RegisterPayment, PaymentType, Customer } from 'pos-models';
import { getHours, getDay, getYear } from 'date-fns';

import * as salesListActions from '../../stores/actions/sales.actions';
import * as customerActions from '../../stores/actions/customer.actions';
import { CustomerEffects } from '../../stores/effects/customer.effects';

@Component({
  selector: 'app-customer-quick-edit-dialog',
  templateUrl: './customer-quick-edit-dialog.component.html',
  styleUrls: ['./customer-quick-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<any>,
    private customerEffects: CustomerEffects,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CustomerQuickEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.customer = data;
  }

  ngOnInit() {
    this.subscription = this.store.select('sales')
      .subscribe(sales => {
        if (sales) {
          const salesByCustomer = sales.filter(s => s.customerId === this.customer.id);
          this.findFavorateProducts(salesByCustomer);
          this.changeDetectorRef.markForCheck();
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
        data: this.customerStats.salesCountByHour.map(d => d.count),
        borderWidth: 1,
        pointRadius: 0,
      }]
    };

    this.salesByDayChartData = {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [{
        data: salesCountByDay,
        borderWidth: 1,
        pointRadius: 0,
      }]
    };

    this.lineChartOptions = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 3
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

  updateCustomer() {
    this.customerEffects.updateCustomer$
      .pipe(
        filter(ac => ac.type === customerActions.UPDATE_CUSTOMER_SUCCESS),
        take(1)
      )
      .subscribe(ac => {
        this.snackBar.open('고객이 업데이트 되었습니다', '확인', { duration: 2000 });
        this.dialogRef.close();
      });
    this.store.dispatch(new customerActions.UpdateCustomer(this.customer));
  }
}
