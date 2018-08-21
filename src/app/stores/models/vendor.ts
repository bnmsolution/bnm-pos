import { Document } from './document';

export class Vendor extends Document {
  name: string;
  description: string;
  businessNumber: string;
  ownerName: string;
  businessType1: string;
  businessType2: string;
  address: string;
  postalCode: string;
  phone: string;
  fax: string;
  email: string;
  web: string;

  constructor() {
    super();
  }
}