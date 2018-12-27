import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, fromEvent, Subject } from 'rxjs';
import { map, takeUntil, debounceTime } from 'rxjs/operators';
import { Product, Customer, ProductVariant, getConcatenatedVariantName, flattenProduct } from 'pos-models';

// import { VariantSelectDialogComponent } from '../variant-select-dialog/variant-select-dialog.component';
// import { Variant } from '../../../product/models/variant';
import * as productActions from 'src/app/stores/actions/product.actions';
import * as customerActions from 'src/app/stores/actions/customer.actions';

@Component({
  selector: 'app-register-search',
  templateUrl: './register-search.component.html',
  styleUrls: ['./register-search.component.scss']
})
export class RegisterSearchComponent implements OnInit, OnDestroy {
  @Output() productSelect = new EventEmitter();
  @Output() customerSelect = new EventEmitter();
  @ViewChild('searchInput') searchInput: ElementRef;

  searchCtrl: FormControl;
  filteredProducts = [];
  filteredCustomers = [];
  products: (Product | ProductVariant)[] = [];
  customers: Customer[] = [];
  bodyKeyPressSubscription: Subscription;
  unsubscribe$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private store: Store<any>) {
  }

  ngOnInit() {
    this.searchCtrl = new FormControl();

    this.store.select('products')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((products: Product[]) =>
        products ? this.products = flattenProduct(products) : this.store.dispatch(new productActions.LoadProducts()));

    this.store.select('customers')
      .subscribe(customers => customers ? this.customers = customers : this.store.dispatch(new customerActions.LoadCustomers()));

    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(300),
        map(filter => {
          return {
            filter,
            products: filter.length > 0 ? this.findProducts(filter) : [],
            customers: filter.length > 0 ? this.findCustomers(filter) : []
          };
        })
      )
      .subscribe(({ filter, products, customers }) => {
        this.handleProductSearch(filter, products);
        this.handleCustomerSearch(filter, customers);
      });

    /** Allows typing or scanning without input focus */
    fromEvent(document, 'keypress')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((e: any) => {
        if (e.target.tagName !== 'INPUT') {
          this.searchInput.nativeElement.focus();
          this.searchCtrl.setValue(e.key);
          e.preventDefault();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  clickProduct(product: Product) {
    if (product.masterProductId) {
      // variant clicked
      this.productSelect.emit({ productId: product.masterProductId, variantId: product.id });
    } else {
      console.log('master product clicked');
      if (product.variants.length) {
        // todo: variant selection dialog
        console.log('product with variants clicked');
      } else {
        this.productSelect.emit({ productId: product.id });
        console.log('product without variant clicked');
      }
    }
  }

  clickCustomer(customer: Customer) {
    this.customerSelect.emit({ customer });
  }

  // /**
  //  * Opens dialog for variants selection.
  //  */
  // selectVariants(product: Product): void {
  //   const dialogRef = this.dialog.open(VariantSelectDialogComponent, {
  //     width: '500px',
  //     data: { product },
  //   });

  //   dialogRef.afterClosed().subscribe((varint: Variant) => {
  //     if (varint) {
  //       this.productSelect.emit({ product, productId: varint.id });
  //     }
  //   });
  // }

  private handleProductSearch(filter, products) {
    if (products.length === 1 && products[0].barcode === filter) {
      this.resetControl();
      this.productSelect.emit({ productId: products[0].id });
    } else {
      this.filteredProducts = products;
    }
  }

  private handleCustomerSearch(filter, customers) {
    if (customers.length === 1 && customers[0].barcode === filter) {
      this.resetControl();
      this.customerSelect.emit({ customer: customers[0] });
    } else {
      this.filteredCustomers = customers;
    }
  }

  /**
   * Search products using name, sku, or barcode.
   * @param filter search value
   */
  private findProducts(filter: string): (Product | ProductVariant)[] {
    return this.products.filter((p: Product) =>
      (p.name && p.name.contains(filter)) ||
      (p.sku && p.sku.contains(filter)) ||
      (p.barcode && p.barcode.contains(filter))
    );
  }

  /**
   * Search customers using name, email, or phone.
   * @param filter search value
   */
  private findCustomers(filter: string): Customer[] {
    return this.customers.filter((c: Customer) =>
      (c.name && c.name.contains(filter)) ||
      (c.email && c.email.contains(filter)) ||
      (c.phone && c.phone.contains(filter)) ||
      (c.barcode && c.barcode.contains(filter))
    );
  }

  resetControl() {
    this.searchCtrl.setValue('', { emitEvent: false });
  }


}
