import { Document } from './document';
import { SaleLineItem } from './saleLineItem';
import { RegisterPayment } from './registerPayment';

export enum SaleStatus {
  Open = 'open',
  Completed = 'completed',
  Hold = 'hold',
  LayBy = 'layby',
  Voided = 'voided',
  Return = 'return',
  ReturnCompleted = 'return_completed',
  ReturnHold = 'return_hold',
  Exchange = 'exchange',
  ExchageCompleted = 'exchange_completed',
  ExchangeHold = 'exchage_hold'
}

export class Sale extends Document {
  shiftId: string;
  customerId: string;

  // todo: adding sales number. it's not optional
  salesNumber: string;

  lineItems: SaleLineItem[] = [];
  payments: RegisterPayment[] = [];

  subTotal = 0;
  totalTax = 0;
  totalDiscount = 0;
  totalPrice = 0;
  change = 0;

  status: SaleStatus;
  salesDate: Date;
  note: string;
  barcode: string;

  constructor(
    private storeId: string,
    private registerId: string,
    private userId: string
  ) {
    super();
    this.status = SaleStatus.Open;
    this.salesDate = new Date();
  }
}