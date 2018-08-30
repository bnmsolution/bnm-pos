import * as uuid from 'uuid/v1';

import {RegisterQuickProduct, MAX_TAB_PRODUCT_NUMBER} from 'pos-models';

export class RegisterTab {
  id: string;
  quickProducts: RegisterQuickProduct[] = [];

  constructor(name = '') {
    this.id = uuid();
    for (let i = 0; i < MAX_TAB_PRODUCT_NUMBER; i++) {
      this.quickProducts.push(new RegisterQuickProduct(i));
    }
  }

  initQuickProducts() {
    this.quickProducts = this._initQuickProducts(this.quickProducts);
    this.quickProducts.forEach(p => {
      p.members = this._initQuickProducts(p.members, true);
    });
  }

  private _initQuickProducts(quickProducts: RegisterQuickProduct[], isMember = false) {
    const result = [];
    quickProducts.forEach(p => {
      const quickProduct = new RegisterQuickProduct();
      Object.assign(quickProduct, p);
      if (isMember) {
        quickProduct.members = [];
      }
      result[quickProduct.position] = quickProduct;
    });

    // fill empty cells
    for (let i = 0; i < MAX_TAB_PRODUCT_NUMBER; i++) {
      if (!result[i]) {
        result[i] = new RegisterQuickProduct(i);
      }
    }

    return result;
  }

  /**
   * Creates a group register quick product.
   * @param position  an index to create group at
   * @param initialMemberIndex
   * @returns {RegisterQuickProduct}
   */
  createGroupQuickProduct(
    dropPosition: number, droppedItemPosition: number): RegisterQuickProduct[] {
    if (!(this.quickProducts[dropPosition].isSingle() && this.isValidPosition(dropPosition))) {
      throw new Error('Target position is not available.');
    }

    const itemAtDropPosition: RegisterQuickProduct = this.quickProducts[dropPosition];
    const droppedItem: RegisterQuickProduct = this.quickProducts[droppedItemPosition];
    itemAtDropPosition.position = 0;
    droppedItem.position = 1;

    const group: RegisterQuickProduct = this.createEmptyQuickProduct(dropPosition);
    group.label = '새그룹';
    // group.members.push(itemAtDropPosition);
    // group.members.push(droppedItem);
    group.addMember(itemAtDropPosition);
    group.addMember(droppedItem);

    // for (let i = 2; i < MAX_TAB_PRODUCT_NUMBER; i++) {
    //   group.members.push(this.createEmptyQuickProduct(i));
    // }

    this.quickProducts[dropPosition] = group;
    this.quickProducts[droppedItemPosition] = this.createEmptyQuickProduct(droppedItemPosition);

    return [group, itemAtDropPosition, droppedItem];
  }

  /**
   * Creates a single or a group type of register quick product.
   * If passed product has variants, it will create a group of
   * quick products with variants as group's member.
   * @param position
   * @param productId
   * @param label
   * @param groupItem
   * @returns {RegisterQuickProduct}
   */
  addQuickProduct(
    position: number, productId: string, label: string, groupItem?: RegisterQuickProduct): RegisterQuickProduct {
    if (!this.isValidPosition(position)) {
      throw new Error('Target position is not available.');
    }

    const quickProduct: RegisterQuickProduct =
      new RegisterQuickProduct(position, productId, label);

    if (!groupItem) {
      this.quickProducts[position] = quickProduct;
    } else {
      // adding it into the group
      groupItem.members[position] = quickProduct;
      quickProduct.position = position;
    }

    return quickProduct;
  }

  /**
   * Factory method creating a single register quick product from product's variants.
   * @param product
   * @param variant
   * @returns {RegisterQuickProduct}
   */
  createQuickProductWithVariant(
    product, variant, position: number): RegisterQuickProduct {
    const quickProduct: RegisterQuickProduct =
      new RegisterQuickProduct(product.id, variant.id, position);
    let variantString: string = variant.option1;
    if (variant.option2) {
      variantString += '-' + variant.option2;
    }
    if (variant.option3) {
      variantString += '-' + variant.option3;
    }
    quickProduct.label = variantString;

    return quickProduct;
  }


  /***
   * Move a quick product to any empty position.
   * New empty quick product will be created at the original position.
   * @param fromIndex
   * @param toIndex
   * @returns {RegisterQuickProduct}
   */
  moveQuickProduct(
    fromIndex: number, toIndex: number, groupItem?: RegisterQuickProduct): RegisterQuickProduct {
    let products = groupItem ? groupItem.members : this.quickProducts;

    if (!products[toIndex].isEmpty() || !this.isValidPosition(toIndex)) {
      throw new Error(`Target position is not available.`);
    }

    products[toIndex] = products[fromIndex];
    products[toIndex].position = toIndex;
    products[fromIndex] = this.createEmptyQuickProduct(fromIndex, groupItem != null);

    return products[toIndex];
  }


  /***
   * Updates an existing quick product.
   * @param quickProduct
   * @param group
   */
  updateQuickProduct(
    quickProduct: RegisterQuickProduct, group?: RegisterQuickProduct): void {
    const quickProducts: RegisterQuickProduct[] = group ? group.members : this.quickProducts;
    const positionToUpdate = quickProducts.findIndex(q => q.position === quickProduct.position);
    quickProducts[positionToUpdate].label = quickProduct.label;
    quickProducts[positionToUpdate].background = quickProduct.background;
  }

  /***
   * Removes quick product and replace with an empty quick product.
   * @param quickProduct
   * @param group
   */
  removeQuickProduct(
    quickProduct: RegisterQuickProduct, group?: RegisterQuickProduct): void {
    const quickProducts = group ? group.members : this.quickProducts;
    const positionToDelete = quickProducts.findIndex(q => q.position === quickProduct.position);
    quickProducts[positionToDelete] = this.createEmptyQuickProduct(positionToDelete, group != null);
  }

  addQuickProductToGroup(groupIndex: number, itemIndex: number): RegisterQuickProduct {
    if (!this.quickProducts[groupIndex].isGroup() || !this.quickProducts[itemIndex].isSingle()) {
      throw new Error(`Target position is not available.`);
    }
    const addedItem = this.quickProducts[groupIndex]
      .addMember(this.quickProducts[itemIndex]);

    if (addedItem) {
      this.quickProducts[itemIndex] = this.createEmptyQuickProduct(itemIndex);
    }

    return addedItem;
  }

  createEmptyQuickProduct(position: number, isGroupMemberQuickProduct = false): RegisterQuickProduct {
    const qp = new RegisterQuickProduct(position);
    if (!isGroupMemberQuickProduct) {
      for (let i = 0; i < MAX_TAB_PRODUCT_NUMBER; i++) {
        qp.members[i] = new RegisterQuickProduct(i);
      }
    }
    return qp;
  }

  private isValidPosition(position: number): boolean {
    return position >= 0 && position < MAX_TAB_PRODUCT_NUMBER;
  }
}
