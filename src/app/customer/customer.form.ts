import { CustomerService } from '../core';
import { Validators } from '@angular/forms';
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
    phone: ['', Validators.required],
    email: '',
    address: '',
    web: null,
    contactName: null,
    contactPhone: null,
    dateOfJoin: new Date(),
    dateOfBirth: null,
    ageGroup: null,
    totalStorePoint: 0,
    currentStorePoint: 0,
    totalSalesCount: 0,
    totalSalesAmount: 0,
    totalReturnsCount: 0,
    note: ''
  };
};

