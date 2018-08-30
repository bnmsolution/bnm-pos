import {ChangeDetectionStrategy, Component, OnInit, Input, OnChanges} from '@angular/core';
import {TopSaleProducts, getDisplayData} from 'pos-models';

@Component({
  selector: 'app-top-sale-products',
  templateUrl: './top-sale-products.component.html',
  styleUrls: ['./top-sale-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopSaleProductsComponent implements OnInit, OnChanges {
  @Input() topSaleProducts: TopSaleProducts;
  @Input() mode: string;
  displayDataByCount: any[] = [];
  displayDataByAmount: any[] = [];

  ngOnChanges() {
    this.topSaleProducts.byCount.forEach((c, i) => {
      this.displayDataByCount[i] = getDisplayData(c.countIncrease);
    });
    this.topSaleProducts.byAmount.forEach((c, i) => {
      this.displayDataByAmount[i] = getDisplayData(c.amountIncrease);
    });
  }

  ngOnInit() {
  }
}
