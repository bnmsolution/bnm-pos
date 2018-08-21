import { Document } from './document';

export enum CustomerType {
  Individual = 'individual',
  Business = 'business'
}

export class Customer extends Document {
  type: CustomerType = CustomerType.Individual;
  name: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  note: string;
  barcode: string;

  gender: string;
  dateOfBirth: Date;
  dateOfJoin: Date = new Date();
  lastPurchasedDate: Date;

  totalStorePoint = 0;
  currentStorePoint = 0;
  totalSalesCount = 0;
  totalSalesAmount = 0;

  businessName: string;
  web: string;
  contactName: string;
  contactPhone: string;

  constructor() {
    super();
  }
}
