import { ChangeDetectionStrategy, Component, OnInit, Input, OnChanges } from '@angular/core';
import { getChangeRateData, getDisplayData } from 'pos-models';

@Component({
  selector: 'app-top-sale-products',
  templateUrl: './top-sale-products.component.html',
  styleUrls: ['./top-sale-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopSaleProductsComponent implements OnInit, OnChanges {
  @Input() productData: any;
  @Input() mode: string;
  topSalesProductsByCount: any[] = [];
  displayDataByCount: any[] = [];
  displayDataByAmount: any[] = [];

  ngOnChanges() {
    // this.topSaleProducts.byCount.forEach((c, i) => {
    //   this.displayDataByCount[i] = getDisplayData(c.countIncrease);
    // });
    // this.topSaleProducts.byAmount.forEach((c, i) => {
    //   this.displayDataByAmount[i] = getDisplayData(c.amountIncrease);
    // });
  }

  ngOnInit() {
    const topSalesProducts = Object.values(this.productData.current.data).sort((a: any, b: any) => b.count - a.count);
    topSalesProducts.forEach((p: any) => {
      const dataToCompare = this.productData.previous.data[p.productId];
      if (dataToCompare) {
        p.changeRate =  getChangeRateData(p.count, dataToCompare.count);
      }
    });
    this.topSalesProductsByCount = topSalesProducts.slice(0, 5);
  }
}
