import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatDialog, MatSidenav} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Register, RegisterSale, RegisterSaleStatus, Customer, Product} from 'pos-models';

import {RegisterService, RegisterSaleService, ProductService, CustomerService, AppState} from 'src/app/core';
import * as registerActions from 'src/app/stores/actions/register.actions';
import * as registerSaleActions from 'src/app/stores/actions/register-sale.actions';

@Component({
  selector: 'app-register',
  styleUrls: ['./register-sale.component.scss'],
  templateUrl: './register-sale.component.html'
})
export class RegisterSaleComponent implements OnInit {
  register: Observable<Register>;
  sale: Observable<RegisterSale>;
  currentRegister: Register;
  currentSale: RegisterSale;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private dialog: MatDialog,
              private registerService: RegisterService,
              private registerSaleService: RegisterSaleService,
              private productService: ProductService,
              private customerService: CustomerService, private route: ActivatedRoute,
              private appState: AppState,
              private router: Router,
              private store: Store<any>) {
  }

  ngOnInit() {
    this.sale = this.store.select('registerSale')
      .pipe(
        map(sale => this.currentSale = sale)
      );

    this.register = this.store.select('registers')
      .pipe(
        map(registers => {
          if (registers) {
            this.currentRegister = Register.Create(registers[0]);
            return this.currentRegister;
          }
        })
      );
    this.store.dispatch(new registerActions.LoadRegisters());
  }

  addCustomer({customer}) {
    if (!this.currentSale) {
      this.createNewSale();
    }
    this.store.dispatch(new registerSaleActions.AddSaleCustomer({customer}));
  }

  removeCustomer() {
    this.store.dispatch(new registerSaleActions.RemoveSaleCustomer());
  }

  addLineItem({productId}) {
    this.productService.getProductById(productId)
      .subscribe(product => {
        if (this.currentSale && this.currentSale.status === RegisterSaleStatus.Return) {
          this.addLinItemForReturn(product);
        } else {
          this.addLineItemForSale(product);
        }
      });
  }

  removeLineItem({id}) {
    this.store.dispatch(new registerSaleActions.RemoveLineItem({id}));
  }

  updateLineItem({id, quantity, retailPrice, discountRate}) {
    this.store.dispatch(new registerSaleActions.UpdateLineItem({id, quantity, retailPrice, discountRate}));
  }

  openPaymentSidenav(): void {
    if (this.currentSale.lineItems.length > 0) {
      this.sidenav.open();
    }
  }

  addPayment({amount, type}): void {
    this.store.dispatch(new registerSaleActions.AddPayment({amount, type}));
  }

  closeSale(): void {
    this.store.dispatch(new registerSaleActions.CloseSale());
    this.sidenav.close();
  }

  holdSale() {
    this.store.dispatch(new registerSaleActions.HoldSale());
    this.sidenav.close();
  }

  voidSale() {
    this.store.dispatch(new registerSaleActions.VoidSale());
    this.sidenav.close();
  }

  private addLineItemForSale(product: Product) {
    if (!this.currentSale) {
      this.createNewSale();
    }
    this.store.dispatch(new registerSaleActions.AddLineItem({
      product,
      productId: product.id,
    }));
  }

  private addLinItemForReturn(product: Product) {
    const originalLineItems = this.currentSale.originalLineItems.filter(ol => ol.productId === product.id);
    if (originalLineItems.length) {
      const originalQuantity = originalLineItems.map(i => i.quantity)
        .reduce((a, b) => a + b, 0);
      const quantity = this.currentSale.lineItems.filter(li => li.productId === product.id)
        .map(i => i.quantity)
        .reduce((a, b) => a + b, 0);
      if (Math.abs(quantity) >= originalQuantity) {
        // todo: display error message
        throw new Error('Cannot return more than the original quantity');
      } else {
        this.store.dispatch(new registerSaleActions.AddLineItem({
          product,
          productId: product.id,
          quantity: -1
        }));
      }
    } else {
      this.addLineItemForSale(product);
    }
  }

  private createNewSale() {
    const appState = this.appState.appState$.getValue();

    this.store.dispatch(new registerSaleActions.CreateSale({
      storeId: appState.store.id,
      registerId: this.currentRegister.id,
      userId: appState.user.id
    }));
  }

  private isReturnItem(productId: string): boolean {
    return this.currentSale.originalLineItems.find(ol => ol.productId === productId) !== undefined;
  }
}
