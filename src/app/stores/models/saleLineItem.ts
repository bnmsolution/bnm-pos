import { Document } from './document';
import { Guid } from '../../shared/utils/guid';

export class SaleLineItem {
  id: string;
  note: string;
  retailPrice: number;
  quantity: number;
  // total price without tax
  subTotal: number;
  // total price with tax
  totalPrice: number;
  totalTax: number;
  totalDiscount: number;
  discountRate: number;

  constructor(private saleId: string,
    private masterProductId: string,
    private productId: string,
    private sku: string,
    private name: string,
    private originalPrice: number,
    private price: number,
    private discount: number,
    private taxId: string,
    private taxRate: number) {
    this.id = Guid.newGuid();
  }
}