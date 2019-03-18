import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { formatNumber } from '@angular/common';
import { Discount, DiscountMethod, DiscountCalculateMethod } from 'pos-models';

@Component({
  selector: 'app-discount-inputs',
  templateUrl: './discount-inputs.component.html',
  styleUrls: ['./discount-inputs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountInputsComponent implements OnInit, OnChanges {

  @Input() discount: Discount;
  @Input() isLineItemDiscount = false;
  @Output() addDiscount = new EventEmitter<Discount>();
  @Output() removeDiscount = new EventEmitter();

  name: string;
  amountOrPercentage: number;
  discountMethod: DiscountMethod = DiscountMethod.FixedAmount;
  calculateMethod: DiscountCalculateMethod = DiscountCalculateMethod.ApplyToTotalPrice;

  discountMethods = DiscountMethod;
  calculateMethods = DiscountCalculateMethod;

  ngOnInit() {
  }

  ngOnChanges(simpleChange) {
    const discount: Discount = simpleChange.discount.currentValue;
    if (discount) {
      const { method, amount, percentage, calculateMethod } = discount;
      this.amountOrPercentage = method === DiscountMethod.FixedAmount ? amount : percentage;
      this.discountMethod = method;
      this.calculateMethod = calculateMethod;
    }
  }

  handleSubmit() {
    const discount = {
      name: this.name,
      method: this.discountMethod,
      calculateMethod: this.calculateMethod,
      amount: null,
      percentage: null
    } as Discount;
    if (this.discountMethod === DiscountMethod.FixedAmount) {
      discount.amount = this.amountOrPercentage;
    } else {
      discount.percentage = this.amountOrPercentage;
    }
    this.addDiscount.emit(discount);
  }
}
