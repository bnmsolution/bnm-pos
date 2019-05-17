import { PaymentType } from 'pos-models';

export const paymentTypeString = {};
paymentTypeString[PaymentType.Cash] = '현금';
paymentTypeString[PaymentType.CreditCard] = '신용카드';
paymentTypeString[PaymentType.GiftCard] = '기프트카드';
paymentTypeString[PaymentType.StorePoint] = '포인트';
