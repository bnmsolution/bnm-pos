import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, debounceTime, filter, take } from 'rxjs/operators';
import { Register, RegisterTab, RegisterQuickProduct, Product, flattenProduct, ProductVariant } from 'pos-models';

import { SingleProductEditDialogComponent } from '../quick-products/single-product-edit-dialog/single-product-edit-dialog.component';
import { GroupProductEditDialogComponent } from '../quick-products/group-product-edit-dialog/group-product-edit-dialog.component';
import { TabEditDialogComponent } from '../quick-products/tab-edit-dialog/tab-edit-dialog.component';
import { cloneDeep } from '../../shared/utils/lang';
import { RegisterEffects } from 'src/app/stores/effects/register.effects';

import * as registerActions from '../../stores/actions/register.actions';
import * as productActions from '../../stores/actions/product.actions';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-register-config',
  templateUrl: './register-config.component.html',
  styleUrls: ['./register-config.component.scss']
})
export class RegisterConfigComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  register: Register;
  productCtrl: FormControl;
  filteredProducts: Observable<(Product | ProductVariant)[]>;
  products: (Product | ProductVariant)[] = [];
  unsubscribe$ = new Subject();
  selectedQuickProductPosition = -1;
  currentTabIndex = 0;
  currentQuickProductGroup: RegisterQuickProduct;

  constructor(private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<any>,
    private registerEffect: RegisterEffects) {
  }

  ngOnInit() {
    this.productCtrl = new FormControl();

    this.store.select('products')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(products => {
        products ? this.products = flattenProduct(products) : this.store.dispatch(new productActions.LoadProducts());
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

    this.store.dispatch(new registerActions.LoadRegisters());

    this.filteredProducts = this.productCtrl.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.unsubscribe$),
        map(searchValue => searchValue ? this.filter(searchValue) : this.products)
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * A filter for product search on autocomplete component.
   * @param {string} searchValue
   */
  filter(searchValue: string): (Product | ProductVariant)[] {
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
  handleOptionSelected(product: Product): void {
    const { id, masterProductId, name } = product;
    if (masterProductId) {
      // variant
      this.register.tabs[this.currentTabIndex]
        .addQuickProduct(this.selectedQuickProductPosition, masterProductId, id, name, this.currentQuickProductGroup);

    } else {
      // master
      this.register.tabs[this.currentTabIndex]
        .addQuickProduct(this.selectedQuickProductPosition, id, null, product.name, this.currentQuickProductGroup);

    }

    this.selectNextEmptyItem();
    this.productCtrl.setValue(null);
  }

  /**
   * An event handler for quick product's drop event.
   * @param {any} {srcQuickProduct, targetQuickProduct}
   */
  onQuickProductDrop({ srcQuickProduct, targetQuickProduct }) {
    const srcPosition = srcQuickProduct.position;
    const targetPosition = targetQuickProduct.position;
    let requireUpdate = false;

    if (this.getQuickProductAt(targetPosition).isEmpty()) {
      // add single to an empty spot
      this.getCurrentRegisterTab().moveQuickProduct(srcPosition, targetPosition, this.currentQuickProductGroup);
      requireUpdate = true;
    } else if (this.shouldCreateGroup(targetPosition, srcPosition)) {
      // create a group with two singles
      this.getCurrentRegisterTab().createGroupQuickProduct(targetPosition, srcPosition);
      requireUpdate = true;
    } else if (this.shouldInsertIntoGroup(targetPosition, srcPosition)) {
      // add single to the group
      this.getCurrentRegisterTab().addQuickProductToGroup(targetPosition, srcPosition);
      requireUpdate = true;
    } else if (this.shouldInsertIntoGroup(srcPosition, targetPosition)) {
      // add single to the grop and move the group to the single's position
      this.getCurrentRegisterTab().addQuickProductToGroup(srcPosition, targetPosition);
      this.getCurrentRegisterTab().moveQuickProduct(srcPosition, targetPosition);
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
    this.selectNextEmptyItem();
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
        this.selectNextEmptyItem();
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
        this.selectNextEmptyItem();
      });
  }

  openTabEditDialog(): void {
    const registerCopy = cloneDeep(this.register);
    this.dialog
      .open(TabEditDialogComponent, { data: { tabs: registerCopy.tabs } })
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
    if (this.currentQuickProductGroup) {
      return this.currentQuickProductGroup.members[position];
    } else {
      return this.getCurrentRegisterTab().quickProducts[position];
    }
  }

  onSubmit(): void {
    const copy = cloneDeep(this.register);
    this.removeEmptyQuickProduct(copy);
    this.store.dispatch(new registerActions.UpdateRegister(copy));
    this.registerEffect.updateRegister$.pipe(
      filter(action => action.type === registerActions.UPDATE_REGISTER_SUCCESS),
      take(1)
    ).subscribe(() => this.snackBar.open('레지스터가 업데이트 되었습니다.', '확인', { duration: 2000 }));
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

  canDeactivate() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '레지스터 설정',
        message: '이 페이지를 벗어나면 마지막 저장 후 수정된 내용은 저장되지 않습니다.'
      }
    }).afterClosed();
  }
}

