import {Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Subscription, fromEvent} from 'rxjs';
import {map, debounceTime} from 'rxjs/operators';
import {Product, Customer} from 'pos-models';

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
  products: Product[] = [];
  customers: Customer[] = [];
  bodyKeyPressSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private store: Store<any>) {
  }

  ngOnInit() {
    this.searchCtrl = new FormControl();

    this.store.select('products')
      .subscribe(products => this.products = products);

    this.store.select('customers')
      .subscribe(customers => this.customers = customers);

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
      .subscribe(({filter, products, customers}) => {
        this.handleProductSearch(filter, products);
        this.handleCustomerSearch(filter, customers);
      });

    this.store.dispatch(new productActions.LoadProducts());
    this.store.dispatch(new customerActions.LoadCustomers());

    /** Allows typing or scanning without input focus */
    this.bodyKeyPressSubscription = fromEvent(document, 'keypress')
      .subscribe((e: any) => {
        if (e.target.tagName !== 'INPUT') {
          this.searchInput.nativeElement.focus();
          this.searchCtrl.setValue(e.key);
          e.preventDefault();
        }
      });
  }

  ngOnDestroy() {
    this.bodyKeyPressSubscription.unsubscribe();
  }

  clickProduct(product: Product) {
    // todo: variant selection dialog
    this.productSelect.emit({productId: product.id});
  }

  clickCustomer(customer: Customer) {
    this.customerSelect.emit({customer});
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
      this.productSelect.emit({productId: products[0].id});
    } else {
      this.filteredProducts = products;
    }
  }

  private handleCustomerSearch(filter, customers) {
    if (customers.length === 1 && customers[0].barcode === filter) {
      this.resetControl();
      this.customerSelect.emit({customer: customers[0]});
    } else {
      this.filteredCustomers = customers;
    }
  }

  /**
   * Search products using name, sku, or barcode.
   * @param filter search value
   */
  private findProducts(filter: string): Product[] {
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

  private resetControl() {
    this.searchCtrl.setValue('', {emitEvent: false});
  }
}
