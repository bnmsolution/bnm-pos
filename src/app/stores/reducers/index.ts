import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */


import { environment } from '../../../environments/environment';
import { categoryListReducer, CategoryListState } from './category-list.reducer';
import { taxListReducer, TaxListState } from './tax-list.reducer';
import { productListReducer, ProductListState } from './product-list.reducer';
import { storeReducer, StoresState } from './store.reducer';
import { employeeListReducer, EmployeeListState } from './employee-list.reducer';
import { customerListReducer, CustomerListState } from './customer-list.reducer';
import { vendorListReducer, VendorListState } from './vendor-list.reducer';
import { registerListReducer, RegisterListState } from './register-list.reducer';
import { authReducer, AuthState } from './auth.reducer';
import { registerSaleReducer, RegisterSaleState } from './register-sale.reducers';
import { saleListReducer, SalesListState } from './sale-list.reducer';

export interface State {
  categories: CategoryListState;
  taxes: TaxListState;
  products: ProductListState;
  stores: StoresState;
  employees: EmployeeListState;
  customers: CustomerListState;
  vendors: VendorListState;
  registers: RegisterListState;
  auth: AuthState;
  registerSale: RegisterSaleState;
  sales: SalesListState;
}

export const reducers: ActionReducerMap<State> = {
  categories: categoryListReducer,
  taxes: taxListReducer,
  products: productListReducer,
  stores: storeReducer,
  employees: employeeListReducer,
  customers: customerListReducer,
  vendors: vendorListReducer,
  registers: registerListReducer,
  auth: authReducer,
  registerSale: registerSaleReducer,
  sales: saleListReducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: any): any => {
    const result = reducer(state, action);
    console.group(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger] : [];

export function getInitialState() {
  return {
    categories: null,
    taxes: null,
    products: null,
    stores: null,
    employees: null,
    customers: null,
    vendors: null,
    registers: null,
    auth: null,
    registerSale: null,
    sales: null
  };
}
