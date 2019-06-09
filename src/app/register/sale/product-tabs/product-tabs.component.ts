import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Register, RegisterQuickProduct } from 'pos-models';

@Component({
  selector: 'app-product-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-tabs.component.html',
  styleUrls: ['./product-tabs.component.scss']
})
export class ProductTabsComponent {

  @Input() register: Register;
  @Output() productSelect: EventEmitter<any> = new EventEmitter<any>();

  selectedRegisterTabIndex = 0;
  quickProducts: RegisterQuickProduct[] = [];
  quickProductGroup: RegisterQuickProduct;

  constructor() { }

  /** Handles the click event on quick product element. */
  handleQuickProductClick(quickProduct: RegisterQuickProduct) {
    const { productId, variantId } = quickProduct;
    if (quickProduct.isGroup()) {
      this.quickProductGroup = quickProduct;
    }

    if (quickProduct.isSingle()) {
      this.productSelect.emit({ productId, variantId });
      // close group view
      this.quickProductGroup = null;
    }

  }
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


