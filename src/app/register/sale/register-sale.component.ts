import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Register, RegisterSale, RegisterSaleStatus, Customer, Product } from 'pos-models';

import { ProductService, AppState } from 'src/app/core';
import * as registerActions from 'src/app/stores/actions/register.actions';
import * as registerSaleActions from 'src/app/stores/actions/register-sale.actions';
import { VariantSelectDialogComponent } from './variant-select-dialog/variant-select-dialog.component';
import { MessageService } from 'src/app/services/message.service';
import { CustomerQuickEditDialogComponent } from '../customer-quick-edit-dialog/customer-quick-edit-dialog.component';

@Component({
  selector: 'app-register',
  styleUrls: ['./register-sale.component.scss'],
  templateUrl: './register-sale.component.html'
})
export class RegisterSaleComponent implements OnInit, OnDestroy {
  register: Observable<Register>;
  sale: Observable<RegisterSale>;
  currentRegister: Register;
  currentSale: RegisterSale;
  unsubscribe$ = new Subject();

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private appState: AppState,
    private router: Router,
    private store: Store<any>) {
  }

  ngOnInit() {
    this.sale = this.store.select('registerSale')
      .pipe(
        map(sale => this.currentSale = sale),
        takeUntil(this.unsubscribe$)
      );

    this.register = this.store.select('registers')
      .pipe(
        map(registers => {
          if (registers) {
            this.currentRegister = Register.Create(registers[0]);
            return this.currentRegister;
          }
        }),
        takeUntil(this.unsubscribe$)
      );

    this.messageService.message$
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(({customer}) => {
        this.openCustomerQuickEditDialog(customer);
      });

    this.store.dispatch(new registerActions.LoadRegisters());

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addCustomer({ customer }) {
    if (!this.currentSale) {
      this.createNewSale();
    }
    this.store.dispatch(new registerSaleActions.AddSaleCustomer({ customer }));
  }

  removeCustomer() {
    this.store.dispatch(new registerSaleActions.RemoveSaleCustomer());
  }

  addLineItem({ productId, variantId }) {
    this.productService.getProductById(productId)
      .subscribe(product => {
        if (product.variants.length && !variantId) {
          this.openVariantSelectDialog(product);
        } else {
          if (this.currentSale && this.currentSale.status === RegisterSaleStatus.Return) {
            this.addLinItemForReturn(product);
          } else {
            this.addLineItemForSale(product, variantId);
          }
        }
      });
  }

  openVariantSelectDialog(product: Product) {
    const dialogRef = this.dialog.open(VariantSelectDialogComponent, {
      data: { product },
    });
    dialogRef.afterClosed().subscribe(variantId => {
      if (variantId) {
        this.addLineItemForSale(product, variantId);
      }
    });
  }

  openCustomerQuickEditDialog(customer: Customer) {
    this.dialog.open(CustomerQuickEditDialogComponent, {
      data: customer
    });
  }

  removeLineItem({ id }) {
    this.store.dispatch(new registerSaleActions.RemoveLineItem({ id }));
  }

  // updateLineItem({ id, quantity, retailPrice, discountRate }) {
  //   this.store.dispatch(new registerSaleActions.UpdateLineItem(
  //     { id, quantity, retailPrice, discountRate }));
  // }

  // updateLineItemAddons({ id, addons }) {
  //   this.store.dispatch(new registerSaleActions.UpdateAddons({ id, addons }));
  // }

  openPaymentSidenav(): void {
    if (this.currentSale.lineItems.length > 0) {
      this.sidenav.open();
    }
  }

  addPayment({ amount, type }): void {
    this.store.dispatch(new registerSaleActions.AddPayment({ amount, type }));
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

  private addLineItemForSale(product: Product, variantId?: string) {
    if (!this.currentSale) {
      this.createNewSale();
    }
    this.store.dispatch(new registerSaleActions.AddLineItem({
      product,
      productId: product.id,
      variantId
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
      userId: appState.user.id,
      priceAdjustmentType: appState.store.totalPriceAdjust
    }));
  }

  private isReturnItem(productId: string): boolean {
    return this.currentSale.originalLineItems.find(ol => ol.productId === productId) !== undefined;
  }
}
