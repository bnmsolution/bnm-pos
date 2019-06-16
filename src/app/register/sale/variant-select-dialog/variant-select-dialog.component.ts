import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product, ProductVariant } from 'pos-models';

/**
 * Component that opens dialog to select varint.
 */
@Component({
  selector: 'app-variant-select-dialog',
  templateUrl: './variant-select-dialog.component.html',
  styleUrls: ['./variant-select-dialog.component.scss']
})
export class VariantSelectDialogComponent {

  public product: Product;
  public currentOptionIndex = 0;
  public selected: string[] = [];

  constructor(private dialogRef: MatDialogRef<VariantSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.product = data.product;
  }

  selectOption(option: string): void {
    this.selected[this.currentOptionIndex] = option;
    if (this.currentOptionIndex === this.product.variantOptions.length - 1) {
      this.completeSelection();
    } else {
      this.currentOptionIndex++;
    }
  }

  switchSelect(index: number): void {
    this.currentOptionIndex = index;
  }

  /**
   * Closes a dialog and return the selected varint.
   */
  completeSelection(): void {
    const optionStr = this.selected.join('');
    const selectedVarint = this.product.variants.find(v => {
      const varintOptionStr = [v.variantOptionValue1, v.variantOptionValue2, v.variantOptionValue3].join('');
      return varintOptionStr === optionStr;
    });
    this.dialogRef.close(selectedVarint.id);
  }
}
