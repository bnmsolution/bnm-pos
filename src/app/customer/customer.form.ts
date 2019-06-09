import { Validators } from '@angular/forms';
import { ProductValidator } from '../shared/validators/product.validator';
import { ProductService, CustomerService } from '../core';
import { CustomerType } from 'pos-models';
import * as uuid from 'uuid/v1';

export const getCustomerForm = (customerService: CustomerService, readOnly = false) => {
  return {
    _id: null,
    _rev: null,
    id: [uuid()],
    type: CustomerType.Individual,
    businessName: null,
    name: '',
    gender: null,
    phone: '',
    email: '',
    address: '',
    web: null,
    contactName: null,
    contactPhone: null,
    dateOfJoin: new Date(),
    birthDay: null,
    totalStorePoint: 0,
    currentStorePoint: 0,
    totalSalesCount: 0,
    totalSalesAmount: 0,
    totalReturnsCount: 0,
    note: ''
  };
};

