import categoryListReducer, * as fomCategoryList from './category-list.reducer';
import texListReducer, * as fomTaxList from './tax-list.reducer';
import productListReducer, * as fromProductList from './product-list.reducer';
import settingsReducer, * as settings from './settings.reducer';
import employeeListReducer, * as fromEmployeeList from './employee-list.reducer';
import customerListReducer, * as fromCustomerList from './customer-list.reducer';
import vendorListReducer, * as fromVendorList from './vendor-list.reducer';
import registerListReducer, * as fromRegisterList from './register-list.reducer';
import authReducer, * as fromAuth from './auth.reducer';
import registerSaleReducer, * as fromRegisterSale from './register-sale.reducers';
import saleListReducer, * as fromSale from './sale-list.reducer';

export interface AppState {
  categories: fomCategoryList.CategoryListState;
  taxes: fomTaxList.TaxListState;
  products: fromProductList.ProductListState;
  settings: settings.SettingsState;
  employees: fromEmployeeList.EmployeeListState;
  customers: fromCustomerList.CustomerListState;
  vendors: fromVendorList.VendorListState;
  registers: fromRegisterList.RegisterListState;
  auth: fromAuth.AuthState;
  registerSale: fromRegisterSale.RegisterSaleState;
  sales: fromSale.SalesListState;
};

export default {
  categories: categoryListReducer,
  taxes: texListReducer,
  products: productListReducer,
  settings: settingsReducer,
  employees: employeeListReducer,
  customers: customerListReducer,
  vendors: vendorListReducer,
  registers: registerListReducer,
  auth: authReducer,
  registerSale: registerSaleReducer,
  sales: saleListReducer
};

