import { Document } from './document';
import { Tax } from '.';

export class Product extends Document {
  name: string;
  sku: string;
  barcode: string;
  description: string;

  masterProductId: string;
  taxId: string;
  categoryId: string;
  vendorId: string;

  supplyPrice: number;
  markup: number;
  retailPrice: number;
  taxAmount: number;
  productPrice: number;

  trackInventory: boolean;
  count: number;
  reOrderPoint: number;
  reOrderCount: number;

  totalSold: number;
  totalSoldAmount: number;

  tax: Tax;

  /**
   * Calculates product price.
   * @param retailPrice
   * @param taxRate
   */
  static getProductPriceFromRetailPrice(retailPrice: number, taxRate: number): number {
    return Math.round(retailPrice / (1 + taxRate));
  }

  static getProductPriceFromMarkup(supplyPrice: number, markup: number): number {
    return markup > 0 ? supplyPrice / (1 - markup / 100) : 0;
  }

  /**
   * Calculates markup percentage.
   * @param productPrice
   * @param supplyPrice
   */
  static getMarkup(productPrice: number, supplyPrice: number): number {
    let markup = 0;
    if (productPrice > 0 && supplyPrice > 0) {
      markup = (productPrice - supplyPrice) / productPrice * 100;
      markup = Math.round(markup * 100) / 100;
    }
    return markup;
  }

  constructor() {
    super();
  }
}
