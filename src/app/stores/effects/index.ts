import {CategoryEffects} from './category.effects';
import {CustomerEffects} from './customer.effects';
import {EmployeeEffects} from './employee.effects';
import {ProductEffects} from './product.effects';
import {RegisterEffects} from './register.effects';
import {RegisterSaleEffects} from './registerSale.effects';
import {StoreEffects} from './store.effects';
import {TaxEffects} from './tax.effects';
import {VendorEffects} from './vendor.effects';

export const effects = [
  CategoryEffects,
  ProductEffects,
  TaxEffects,
  StoreEffects,
  EmployeeEffects,
  CustomerEffects,
  VendorEffects,
  RegisterEffects,
  RegisterSaleEffects
];
