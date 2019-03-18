import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatChipInputEvent, MatTableDataSource } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Product, ProductVariant, ProductVariantOption } from 'pos-models';
import { cloneDeep } from 'src/app/shared/utils/lang';
import { ProductService } from 'src/app/core';


@Component({
  selector: 'app-variant-options',
  templateUrl: './variant-options.component.html',
  styleUrls: ['./variant-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariantOptionsComponent implements OnInit {
  @Input() product: Product;
  @Input() readonly: boolean;

  variantOptions: ProductVariantOption[];
  variants: ProductVariant[];

  displayedColumns: string[] = ['name', 'values', 'actions'];
  variantDisplayedColumns: string[] = [];

  dataSource: MatTableDataSource<ProductVariantOption>;
  variantsDataSource: MatTableDataSource<any>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selectable = true;
  removable = true;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.variantOptions = cloneDeep(this.product.variantOptions);
    this.variants = cloneDeep(this.product.variants);
    this.dataSource = new MatTableDataSource();
    this.variantsDataSource = new MatTableDataSource();
    this.generateProductVariants();
    this.updateVariantOptionTable();
    this.selectable = !this.readonly;
    this.removable = !this.readonly;
  }

  addNewVariantOption() {
    if (this.variantOptions.length < 3) {
      this.variantOptions.push({ name: '', values: [] });
      this.updateVariantOptionTable();
    }
  }

  removeVariantOption(index) {
    this.variantOptions = this.variantOptions.filter((vo, i) => i !== index);
    this.generateProductVariants();
    this.updateVariantOptionTable();
  }

  addVariantOptionValue(index: number, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    const variantOption = this.variantOptions[index];

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
      ...this.variantOptions.map((v, i) => `option${i + 1}`),
      ...fields
    ];
    this.dataSource.data = this.variantOptions;
  }

  /** Generates product variants **/
  private generateProductVariants() {
    const originalVariants = cloneDeep(this.variants);
    const variantOptionsWithValues = this.variantOptions.filter(vo => vo.values.length);

    if (variantOptionsWithValues.length) {
      const allPossibleVariants = this.allPossibleCases(this.variantOptions.filter(vo => vo.values.length).map(v => v.values));
      const newVariants = allPossibleVariants.map(options => {
        const id = `${this.product.id}_${options}`;
        const originalVariant = originalVariants.find(v => v.id === id);
        const optionValues = options.split('|');

        if (originalVariant) {
          return Object.assign({}, originalVariant);
        } else {
          const newVariant = { id } as ProductVariant;

          // assining option values
          optionValues.forEach((ov, i) => {
            newVariant[`variantOptionValue${i + 1}`] = ov;
          });

          // assining master product's price and supply price
          newVariant.retailPrice = this.product.retailPrice;
          newVariant.supplyPrice = this.product.supplyPrice;

          return newVariant;
        }
      });
      this.variants = newVariants as ProductVariant[];
    } else {
      this.variants = [];
    }

    this.variantsDataSource.data = this.variants;
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
