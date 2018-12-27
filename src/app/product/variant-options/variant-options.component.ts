import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatChipInputEvent, MatTableDataSource } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Product, ProductVariant, ProductVariantOption } from 'pos-models';


@Component({
  selector: 'app-variant-options',
  templateUrl: './variant-options.component.html',
  styleUrls: ['./variant-options.component.scss']
})
export class VariantOptionsComponent implements OnInit {
  @Input() product: Product;
  @Input() readonly: boolean;

  variantOptions: ProductVariantOption[] = [];
  variants: ProductVariant[] = [];

  displayedColumns: string[] = ['name', 'values', 'actions'];
  variantDisplayedColumns: string[] = [];

  dataSource: MatTableDataSource<ProductVariantOption>;
  variantsDataSource: MatTableDataSource<any>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selectable = true;
  removable = true;

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.variantsDataSource = new MatTableDataSource();
    this.generateProductVariants();
    this.updateVariantOptionTable();
    this.selectable = !this.readonly;
    this.removable = !this.readonly;
  }

  addNewVariantOption() {
    if (this.product.variantOptions.length < 3) {
      this.product.variantOptions.push({ name: '', values: [] });
      this.updateVariantOptionTable();
    }
  }

  removeVariantOption(index) {
    this.product.variantOptions = this.product.variantOptions.filter((vo, i) => i !== index);
    this.generateProductVariants();
    this.updateVariantOptionTable();
  }

  addVariantOptionValue(index: number, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    const variantOption = this.product.variantOptions[index];

    if (value.length > 0 && variantOption.values.indexOf(value) === -1) {
      variantOption.values.push(value);
    }

    if (input) {
      input.value = '';
    }
    this.generateProductVariants();
  }

  removeVariantOptionValue(variantOption: ProductVariantOption, value: string) {
    variantOption.values = variantOption.values.filter(v => v !== value);
    this.generateProductVariants();
  }

  private updateVariantOptionTable() {
    const fields = ['supplyPrice', 'retailPrice', 'barcode', 'sku'];
    if (this.product.trackInventory) {
      fields.push('count', 'reOrderPoint');
    }
    this.variantDisplayedColumns = [
      ...this.product.variantOptions.map((v, i) => `option${i + 1}`),
      ...fields
    ];
    this.dataSource.data = this.product.variantOptions;
  }

  private generateProductVariants() {
    const { variantOptions, variants } = this.product;
    const originalVariants = JSON.parse(JSON.stringify(variants));
    const variantOptionsWithValues = variantOptions.filter(vo => vo.values.length);

    if (variantOptionsWithValues.length) {
      const allPossibleVariants = this.allPossibleCases(variantOptions.filter(vo => vo.values.length).map(v => v.values));
      const newVariants = allPossibleVariants.map(options => {
        const id = `${this.product.id}_${options}`;
        const originalVariant = originalVariants.find(v => v.id === id);
        const values = options.split('|');

        if (originalVariant) {
          return Object.assign({}, originalVariant);
        } else {
          const newVariant = { id };
          values.forEach((v, i) => {
            newVariant[`variantOptionValue${i + 1}`] = v;
          });
          return newVariant;
        }
      });
      this.product.variants = newVariants as ProductVariant[];
    } else {
      this.product.variants = [];
    }

    this.variantsDataSource.data = this.product.variants;
  }


  /**
  * Returns all possible combinations of variants.
  * @param {any[]} an array of arraies of option values
  *                example) [["16G", "32G"], ["black", "white"], ["i5", "i7]]
  * @returns {string[]} all possible combinations
  *                      example) [ "16G|black|i5", "16G|black|i7", ...]
  */
  private allPossibleCases(optionArray: any[]): string[] {
    if (optionArray.length === 1) {
      return optionArray[0];
    } else if (optionArray.length > 1) {
      const result: string[] = [];
      const allCasesOfRest: string[] = this.allPossibleCases(optionArray.slice(1));
      for (let i = 0; i < allCasesOfRest.length; i++) {
        for (let j = 0; j < optionArray[0].length; j++) {
          result.push(optionArray[0][j] + '|' + allCasesOfRest[i]);
        }
      }
      return result;
    }
  }
}
