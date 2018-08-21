import { Document } from './document';
import { Guid } from '../../shared/utils/guid';
import { RegisterTab, MAX_TAB_PRODUCT_NUMBER } from '../../stores/models/registerTab';
import { RegisterQuickProduct } from '../../stores/models/registerQuickProduct';

export class Register extends Document {
  name: string;
  description: string;
  tabs: RegisterTab[];

  static Create(payload: Register): Register {
    const register = new Register();
    Object.assign(register, payload);
    register.initTabs();
    return register;
  }

  constructor() {
    super();
    this.tabs = [new RegisterTab('Default Tab')];
  }

  /**
   * Creates a single or a group type of register quick product.
   * If passed product has variants, it will create a group of 
   * quick products with variants as group's member.
   * @param position
   * @param product
   * @returns {RegisterQuickProduct}
   */
  addQuickProduct(
    tabIndex: number,
    position: number,
    product: any,
    groupQuickProducPosition?: number) {
    if (!this.isValidPosition(position)) {
      throw new Error(`Target position is not available.`);
    }

    const tab = this.tabs[tabIndex];
    const label = product.name || product.label;
    const quickProduct: RegisterQuickProduct =
      new RegisterQuickProduct(position, product.id, label);

    if (groupQuickProducPosition != null) {
      tab.quickProducts[groupQuickProducPosition].members[position] = quickProduct;
    } else {
      tab.quickProducts[position] = quickProduct;
    }
  }

  RepositionQuickProduct(
    tabIndex: number,
    position: number,
    groupQuickProducPosition?: number): void {
    const tab = this.tabs[tabIndex];
  }

  /** Initiates product tabs and quick products in the each tab. If no tabs exists, it creates the default tab. */
  private initTabs(): void {
    if (this.tabs.length === 0) {
      this.tabs = [new RegisterTab('Default Tab')];
    } else {
      this.tabs = this.tabs.map(t => {
        const tab = new RegisterTab();
        Object.assign(tab, t);
        tab.initQuickProducts();
        return tab;
      });
    }
    // this.tabs.forEach(tab => this.initQuickProducts(tab));
  }

  /** Initiates quick products in the tab. */
  private initQuickProducts(tab: RegisterTab): void {
    // create empty spot with empty quick product.
    for (let i = 0; i < MAX_TAB_PRODUCT_NUMBER; i++) {
      if (!tab.quickProducts[i]) {
        tab.quickProducts[i] = new RegisterQuickProduct(i);
      }
    }
  }

  private isValidPosition(position: number): boolean {
    return position >= 0 && position < MAX_TAB_PRODUCT_NUMBER;
  }
}
