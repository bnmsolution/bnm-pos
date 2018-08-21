export const QuickProductColors = ['#EC407A', '#AB47BC', '#5C6BC0', '#26A69A', '#66BB6A', '#FFA726', '#8D6E63', '#78909C', '#424242'];

export class RegisterQuickProduct {
  background = '#424242';
  members: RegisterQuickProduct[] = [];

  constructor(public position = -1, public productId?, public label?) {
  }

  /**
 * Adds a quick product into the members.
 * @param quickProduct
 * @returns {RegisterQuickProduct}
 */
  addMember(quickProduct: RegisterQuickProduct): RegisterQuickProduct {
    const indexToAdd = this.findEmptyQuickProductMemberIndex();
    if (indexToAdd > -1) {
      this.members[indexToAdd] = quickProduct;
      quickProduct.position = indexToAdd;
    }
    return this.members[indexToAdd];
  }

  isEmpty(): boolean {
    return !this.productId &&
      this.members.filter(m => m.isSingle()).length === 0;
  }

  isSingle(): boolean {
    return this.productId &&
      this.members.filter(m => m.isSingle()).length === 0;
  }

  isGroup(): boolean {
    return this.members.filter(m => m.isSingle()).length > 0;
  }

  /***
 * Return total number of group members.
 * @returns {number}
 */
  getNonEmptyMemberCount(): number {
    return this.members.filter(m => m.isSingle()).length;
  }

  /**
   * Finds an empty spot in the members.
   * @returns {number} Index of empty spot.
   */
  private findEmptyQuickProductMemberIndex(): number {
    return this.members.findIndex(m => m.isEmpty());
  }
}
