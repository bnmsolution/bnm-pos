import { Guid} from '../../shared';
import {Tax, getTaxAmountFromRetailPrice} from 'pos-models';

export interface RegisterSaleLineItem {
  id: string;
  productId: string;
  name: string;
  taxId: string;
  taxRate: number;
  variantId?: string;
  note?: string;

  originalPrice: number;
  retailPrice: number;
  quantity: number;
  discount: number;
  discountRate: number;

  // TOTALS
  subTotal: number;       // total without tax
  totalTax: number;
  totalPrice: number;     // subtotal + tax
  totalDiscount: number;

  errors: object;
}

export const createLineItem = (
  productId: string,
  name: string,
  price: number,
  taxId: string,
  taxRate: number,
  quantity = 1
): RegisterSaleLineItem => {
  const lineItem: RegisterSaleLineItem = {
    id: Guid.newGuid(),
    productId,
    name,
    taxId,
    taxRate,
    originalPrice: price,
    retailPrice: price,
    quantity,
    discount: 0,
    subTotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    totalPrice: 0,
    discountRate: 0,
    errors: {}
  };
  calculateTotals(lineItem);
  return lineItem;
};

export const increaseQuantity = (lineItem: RegisterSaleLineItem, quantity: number): RegisterSaleLineItem => {
  const item = {...lineItem};
  item.quantity += quantity;
  calculateTotals(item);
  return item;
};

export const decreaseQuantity = (lineItem: RegisterSaleLineItem, quantity: number): RegisterSaleLineItem => {
  const item = {...lineItem};

  if (item.quantity < quantity) {
    // todo: handle exception
  } else {
    item.quantity -= quantity;
    calculateTotals(item);
  }

  return item;
};

export const setDiscountRate = (lineItem: RegisterSaleLineItem, rate: number): RegisterSaleLineItem => {
  const item = {...lineItem};
  // rouding value using configuration.
  item.discountRate = rate;
  item.discount = item.originalPrice * (rate / 100);
  item.retailPrice = item.originalPrice - item.discount;
  calculateTotals(item);
  return item;
};

export const setRetailPrice = (lineItem: RegisterSaleLineItem, price: number): RegisterSaleLineItem => {
  const item = {...lineItem};
  item.retailPrice = price;

  if (item.originalPrice > item.retailPrice) {
    item.discount = item.originalPrice - price;
    item.discountRate = Math.round(item.discount / item.originalPrice * 100);
  } else {
    item.discount = 0;
    item.discountRate = 0;
  }

  calculateTotals(item);
  return item;
};

export const setQuantity = (lineItem: RegisterSaleLineItem, quantity: number): RegisterSaleLineItem => {
  const item = {...lineItem};

  if (quantity < 1) {
    // todo: handle exception
  } else {
    item.quantity = quantity;
    calculateTotals(item);
  }

  return item;
};


// Helper functions

const calculateTotals = (lineItem: RegisterSaleLineItem): void => {
  lineItem.subTotal = lineItem.retailPrice * lineItem.quantity;
  lineItem.totalPrice = lineItem.subTotal;
  lineItem.totalDiscount = lineItem.discount * lineItem.quantity;
  lineItem.totalTax = getTaxAmountFromRetailPrice(lineItem.totalPrice, lineItem.taxRate);
};


// export class RegisterSaleLineItem {
//   id: string;
//   note; string;

//   private _originalPrice: number;
//   private _retailPrice: number;
//   private _quantity: number;
//   private _discount: number;
//   // total price without tax
//   private _subTotal: number;
//   // total price with tax
//   private _totalPrice: number;
//   private _totalTax: number;
//   private _totalDiscount: number;
//   private _discountRate: number;

//   // store the original line item for the returning quantity invariant.
//   origianlLineItem: RegisterSaleLineItem;
//   hasError = false;
//   errors: any = {};

//   // todo: discount
//   constructor(
//     public productId: string,
//     public name: string,
//     price: number,
//     public taxId: string,
//     public taxRate: number,
//     quantity = 1) {
//     this.id = Guid.newGuid();
//     this._originalPrice = price;
//     this._retailPrice = price;
//     this._quantity = 0;
//     this._subTotal = 0;
//     this._totalTax = 0;
//     this._totalDiscount = 0;
//     this._totalPrice = 0;
//     this._discountRate = 0;
//     this.increaseQuantity(quantity);
//   }

//   get retailPrice() {
//     return this._retailPrice;
//   }

//   /**
//    * Sets new retail price.
//    * If new price is less than the original price, it will add the difference as discount acmount.
//    */
//   set retailPrice(price: number) {
//     if (typeof price === 'string') {
//       price = parseFloat(price);
//     }
//     const diff = this._originalPrice - price;
//     if (diff > 0) {
//       this._discount = diff;
//       this._discountRate = PosMath.round(this._discount / this._originalPrice * 100, 2);
//       this._retailPrice = price;
//     } else if (diff < 0) {
//       // change markup
//     } else {
//       this._retailPrice = this._originalPrice;
//       this._discount = 0;
//       this._discountRate = 0;
//     }
//     this.calculateTotals();
//   }

//   get quantity() {
//     return this._quantity;
//   }

//   /**
//    * Sets new quantity.
//    * Check returning invariant: quantity of returnning item cannot be more than the origianl quantity.
//    */
//   set quantity(quantity) {
//     this._quantity = quantity;
//     this.calculateTotals();

//     // quantity of non-return sale's line item cannot be less than 0
//     if (this.origianlLineItem === undefined && quantity <= 0) {
//       this.errors.invalidQuantity = {
//         message: '잘못된 수량입니다'
//       };
//       return;
//     }

//     if (quantity < 0 && this.origianlLineItem) {
//       if (Math.abs(quantity) > this.origianlLineItem._quantity) {
//         this.hasError = true;
//         this.errors.invalidReturnQuantity = {
//           message: '잘못된 수량입니다'
//         };
//       }
//       return;
//     }

//     delete this.errors.invalidQuantity;
//   }

//   get discount() {
//     return this._discount;
//   }

//   get originalPrice() {
//     return this._originalPrice;
//   }

//   get subTotal() {
//     return this._subTotal;
//   }

//   get totalPrice() {
//     return this._totalPrice;
//   }

//   get totalTax() {
//     return this._totalTax;
//   }

//   get totalDiscount() {
//     return this._totalDiscount;
//   }

//   get discountRate() {
//     return this._discountRate;
//   }

//   set discountRate(value: any) {
//     const rate = parseFloat(value);
//     if (rate > 0) {
//       this._discountRate = rate >= 100 ? 100 : PosMath.round(rate, 2);
//       this._discount = PosMath.round(this._originalPrice * (this._discountRate / 100), 2);
//       this._retailPrice = this._originalPrice - this._discount;
//     } else if (rate === 0) {
//       this._discount = 0;
//       this._retailPrice = this._originalPrice;
//     }
//     this.calculateTotals();
//   }

//   increaseQuantity(quantity = 1): number {
//     this._quantity += quantity;
//     this.calculateTotals();

//     return this._quantity;
//   }

//   decreaseQuantity(quantity = 1): number {
//     if (this._quantity < quantity) {
//       // todo: handle exception
//     } else {
//       this._quantity -= quantity;
//       this.calculateTotals();
//     }

//     return this._quantity;
//   }

//   calculateTotals(): void {
//     this._subTotal = this._retailPrice * this._quantity;
//     this._totalPrice = this._subTotal;
//     this._totalDiscount = this._discount * this._quantity;
//     this._totalTax = Tax.getTaxAmountFromRetailPrice(this._totalPrice, this.taxRate);
//   }

//   isValid(): boolean {
//     return !Object.keys(this.errors).length;
//   }

// }
