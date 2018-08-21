import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Register, RegisterQuickProduct } from 'pos-models';

// import { VariantSelectDialogComponent } from '../variant-select-dialog/variant-select-dialog.component';
import { RegisterSaleService, ProductService } from 'src/app/core';
// import { Variant } from '../../../product/models/variant';
import * as registerSaleActions from '../../../stores/actions/register-sale.actions';

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

  constructor(
    private dialog: MatDialog,
    private registerSaleService: RegisterSaleService,
    private productService: ProductService) { }

  /** Handles the click event on quick product element. */
  handleQuickProductClick(quickProduct: RegisterQuickProduct) {
    if (quickProduct.isGroup()) {
      this.quickProductGroup = quickProduct;
    }

    if (quickProduct.isSingle()) {
      this.productSelect.emit({ productId: quickProduct.productId });
      // close group view
      this.quickProductGroup = null;
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


}
