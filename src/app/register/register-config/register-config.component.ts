import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {startWith, map, takeUntil} from 'rxjs/operators';
import {Register, RegisterTab, RegisterQuickProduct, Product} from 'pos-models';

import {SingleProductEditDialogComponent} from '../quick-products/single-product-edit-dialog/single-product-edit-dialog.component';
import {GroupProductEditDialogComponent} from '../quick-products/group-product-edit-dialog/group-product-edit-dialog.component';
import {RegisterService, ProductService} from '../../core';
import {TabEditDialogComponent} from '../quick-products/tab-edit-dialog/tab-edit-dialog.component';


import * as registerActions from '../../stores/actions/register.actions';
import * as productActions from '../../stores/actions/product.actions';
import {cloneDeep} from '../../shared/utils/lang';

@Component({
  selector: 'app-register-config',
  templateUrl: './register-config.component.html',
  styleUrls: ['./register-config.component.scss']
})
export class RegisterConfigComponent implements OnInit, OnDestroy {

  register: Register;
  productCtrl: FormControl;
  filteredProducts: Observable<Product[]>;
  products: Product[];
  unsubscribe$ = new Subject();
  selectedQuickProductPosition = -1;
  currentTabIndex = 0;
  currentQuickProductGroup: RegisterQuickProduct;

  constructor(private dialog: MatDialog,
              private registerService: RegisterService,
              private productService: ProductService,
              private store: Store<any>) {
  }

  ngOnInit() {
    this.productCtrl = new FormControl();

    this.store.select('products')
      .subscribe(products => {
        this.products = products || [];
        this.filteredProducts = this.productCtrl.valueChanges
          .pipe(
            startWith(null),
            takeUntil(this.unsubscribe$),
            map(searchValue => searchValue ? this.filter(searchValue) : this.products)
          );
      });

    this.store.select('registers')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(registers => {
        if (registers) {
          this.register = Register.Create(registers[0]);
          this.selectNextEmptyItem();
        }
      });

    this.store.dispatch(new productActions.LoadProducts());
    this.store.dispatch(new registerActions.LoadRegisters());
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * A filter for product search on autocomplete component.
   * @param {string} searchValue
   */
  filter(searchValue: string): Product[] {
    return this.products.filter((p: Product) => {
      return p.name.contains(searchValue) ||
        (p.sku && p.sku.contains(searchValue)) ||
        (p.barcode && p.barcode.contains(searchValue));
    });
  }


  /**
   * An event handler for autocomplete option click event.
   * It will add quick product into the selected position.
   * @param {Product} product
   */
  onOptionClick(product: Product): void {
    this.register.tabs[this.currentTabIndex]
      .addQuickProduct(this.selectedQuickProductPosition, product.id, product.name, this.currentQuickProductGroup);

    this.selectNextEmptyItem();
    this.productCtrl.setValue(null);
  }

  /**
   * An event handler for quick product's drop event.
   * @param {any} {srcQuickProduct, targetQuickProduct}
   */
  onQuickProductDrop({srcQuickProduct, targetQuickProduct}) {
    const srcPosition = srcQuickProduct.position;
    const targetPosition = targetQuickProduct.position;
    let requireUpdate = false;
    if (this.getQuickProductAt(targetPosition).isEmpty()) {
      this.getCurrentRegisterTab().moveQuickProduct(srcPosition, targetPosition, this.currentQuickProductGroup);
      requireUpdate = true;
    } else if (this.shouldCreateGroup(targetPosition, srcPosition)) {
      this.getCurrentRegisterTab().createGroupQuickProduct(targetPosition, srcPosition);
      requireUpdate = true;
    } else if (this.shouldInsertIntoGroup(targetPosition, srcPosition)) {
      this.getCurrentRegisterTab().addQuickProductToGroup(targetPosition, srcPosition);
      requireUpdate = true;
    }

    if (requireUpdate) {
      this.selectNextEmptyItem();
    }
  }

  /**
   * An event handler for tab change event.
   * @param tabIndex
   */
  onTabChange(tabIndex) {
    this.currentTabIndex = tabIndex;
  }

  /**
   * An event handler for quick product's click event.
   * @param {RegisterQuickProduct} quickProduct
   */
  onQuickProductClick(quickProduct: RegisterQuickProduct) {
    if (quickProduct.isSingle()) {
      this.openSingleProductEditDialog(quickProduct);
    } else if (quickProduct.isGroup()) {
      this.currentQuickProductGroup = quickProduct;
      this.selectNextEmptyItem();
    } else if (this.currentQuickProductGroup != null) {
      this.selectedQuickProductPosition = quickProduct.position;
    }
  }

  /**
   * Opens quick product edit dialog. Dialog will return 'update' or 'delete' action.
   * @param {RegisterQuickProduct} quickProduct
   */
  openSingleProductEditDialog(quickProduct: RegisterQuickProduct) {
    const product = this.products.find(p => p.id === quickProduct.productId);
    const quickProductCopy = Object.assign({}, quickProduct);
    this.dialog
      .open(SingleProductEditDialogComponent, {
        data: {
          quickProduct: quickProductCopy,
          product
        }
      })
      .afterClosed()
      .subscribe((action: string) => {
        const currentTab = this.getCurrentRegisterTab();
        if (action === 'update') {
          currentTab.updateQuickProduct(quickProductCopy, this.currentQuickProductGroup);
        } else if (action === 'delete') {
          currentTab.removeQuickProduct(quickProductCopy, this.currentQuickProductGroup);
        }
      });
  }

  /**
   * Opens group edit dialog. Dialog will return 'update' or 'delete' action.
   * @param {RegisterQuickProduct} quickProduct
   */
  openGroupEditDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      quickProduct: JSON.parse(JSON.stringify(this.currentQuickProductGroup)),
    };
    this.dialog
      .open(GroupProductEditDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((action: string) => {
        if (action === 'update') {
          this.getCurrentRegisterTab().updateQuickProduct(dialogConfig.data.quickProduct);
        } else if (action === 'delete') {
          this.getCurrentRegisterTab().removeQuickProduct(dialogConfig.data.quickProduct);
          this.currentQuickProductGroup = undefined;
        }
      });
  }

  openTabEditDialog(): void {
    const dialogConfig = new MatDialogConfig();
    const registerCopy = cloneDeep(this.register);
    this.dialog
      .open(TabEditDialogComponent, {data: {tabs: registerCopy.tabs}})
      .afterClosed()
      .subscribe((action: string) => {
        const register = Register.Create(registerCopy);
        this.register = register;
      });
  }

  closeGroup(): void {
    this.currentQuickProductGroup = null;
    this.selectNextEmptyItem();
  }

  private shouldCreateGroup(dropPosition: number, droppedItemPosition: number): boolean {
    return this.getQuickProductAt(dropPosition).isSingle() && this.getQuickProductAt(droppedItemPosition).isSingle();
  }

  private shouldInsertIntoGroup(dropPosition: number, droppedItemPosition: number): boolean {
    return this.getQuickProductAt(dropPosition).isGroup() && this.getQuickProductAt(droppedItemPosition).isSingle();
  }

  /**
   * Selects next avaliable empty quick product.
   */
  private selectNextEmptyItem(): void {
    let nextEmptyItemIndex = -1;
    const quickProducts: RegisterQuickProduct[] = this.currentQuickProductGroup ?
      this.currentQuickProductGroup.members : this.getCurrentRegisterTab().quickProducts;
    nextEmptyItemIndex = quickProducts.findIndex(q => q.isEmpty());
    this.selectedQuickProductPosition = nextEmptyItemIndex;
  }

  private getCurrentRegisterTab(): RegisterTab {
    return this.register.tabs[this.currentTabIndex];
  }

  private getQuickProductAt(position: number): RegisterQuickProduct {
    return this.getCurrentRegisterTab().quickProducts[position];
  }

  onSubmit(): void {
    const copy = cloneDeep(this.register);
    this.removeEmptyQuickProduct(copy);
    this.store.dispatch(new registerActions.UpdateRegister(copy));
  }

  /**
   * Remove empty quick products in order to reduce payload size.
   * @param register
   */
  private removeEmptyQuickProduct(register: Register): void {
    register.tabs.forEach(tab => {
      tab.quickProducts.forEach(qp => {
        qp.members = qp.members.filter(m => m.productId);
        qp.members.forEach(mp => mp.members = []);
      });
      tab.quickProducts = tab.quickProducts.filter(qp => qp.productId || qp.members.length);
    });
  }
}

