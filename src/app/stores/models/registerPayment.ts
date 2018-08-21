import { Document } from './document';
import { Guid } from '../../shared/utils/guid';

export enum RegisterTransactionStatus {
  ERROR = 'error',
  SUCCESS = 'success',
  PENDING = 'peding',
  FAILURE = 'failure'
}

export enum RegisterTransactionType {
  Sale = 'sale',
  Return = 'return'
}

export enum PaymentType {
  Cash = 'cash',
  CreditCard = 'credit',
  GiftCard = 'gift_card',
  StorePoint = 'store_point'
}

export interface RegisterPayment {
  id: string;
  type: RegisterTransactionType;
  status?: RegisterTransactionStatus;
  paymentType: PaymentType;
  amount: number;
}

export const createPayment = (
  type: RegisterTransactionType,
  paymentType: PaymentType,
  amount: number
): RegisterPayment => {
  return {
    id: Guid.newGuid(),
    type,
    paymentType,
    amount
  }
}



// export class RegisterPayment {
//   id: string;
//   status: RegisterTransactionStatus;
//   transactionDate: Date;

//   constructor(
//     public saleId: string,
//     public type: RegisterTransactionType,
//     public paymentType: PaymentType,
//     public amount: number) {
//     this.id = Guid.newGuid();
//     this.transactionDate = new Date();
//   }
// }