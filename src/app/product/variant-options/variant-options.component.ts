import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ProductVariant, ProductVariantOption } from 'pos-models';

import { cloneDeep } from 'src/app/shared/utils/lang';
import { ProductService } from 'src/app/core';
import { ProductValidator } from 'src/app/shared/validators/product.validator';
import { getOptions } from 'src/app/shared/config/currency-mask.config';

const MAX_VARIANT_OPTIONS = 3;

@Component({
  selector: 'app-variant-options',
  templateUrl: './variant-options.component.html',
  styleUrls: ['./variant-options.component.scss']
})
export class VariantOptionsComponent implements OnInit {
  @Input() productForm: FormGroup;
  @Input() readonly: boolean;
  @Input() isFormSubmitted: boolean;

  // Mat table
  displayedColumns: string[] = ['name', 'values', 'actions'];
  variantDisplayedColumns: string[] = [];
  dataSource: MatTableDataSource<ProductVariantOption>;
  variantsDataSource: MatTableDataSource<any>;

  // Mat chip
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;

  currencyMaskOptions = getOptions;

  get variantOptionsControl(): FormArray {
    return this.productForm.controls.variantOptions as FormArray;
  }

  get variantsControl(): FormArray {
    return this.productForm.controls.variants as FormArray;
  }

  constructor(private productService: ProductService, private fb: FormBuilder) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.variantsDataSource = new MatTableDataSource();
    this.generateProductVariants();
    this.updateVariantOptionTable();
    this.selectable = !this.readonly;
    this.removable = !this.readonly;
  }

  addNewVariantOption() {
    if (this.variantOptionsControl.length < MAX_VARIANT_OPTIONS) {
      this.variantOptionsControl.push(
        this.fb.group({
          name: [''],
          values: [[]]
        })
      );
      this.updateVariantOptionTable();
    }
  }

  removeVariantOption(index) {
    this.variantOptionsControl.removeAt(index);
    this.generateProductVariants();
    this.updateVariantOptionTable();
  }

  /**
   * An event handler for mat-chip inputTokenEnd event.
   * It will add a new value of varaint option.
   * @param index index of variant option
   * @param event mat-chip change event
   */
  addVariantOptionValue(index: number, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    const variantOptionValues = this.variantOptionsControl.value[index].values;

    if (value.length > 0 && variantOptionValues.indexOf(value) === -1) {
      variantOptionValues.push(value);
    }

    if (input) {
      input.value = '';
    }

    this.generateProductVariants();
  }

  /**
   * An event handler for mat-chip remove event.
   * It will remove matched variant option value.
   * @param index index of variant option
   * @param value variant option value
   */
  removeVariantOptionValue(index: number, value: string) {
    const valueCopy = cloneDeep(this.variantOptionsControl.value);
    valueCopy[index].values = valueCopy[index].values.filter(v => v !== value);
    this.variantOptionsControl.setValue(valueCopy);
    this.generateProductVariants();
  }

  /** Updating the list of displaying fields and data for variant option table. */
  private updateVariantOptionTable() {
    const fields = ['supplyPrice', 'retailPrice', 'barcode', 'sku'];
    if (this.productForm.value.trackInventory) {
      fields.push('count', 'reOrderPoint');
    }

    this.variantDisplayedColumns = [
      ...this.variantOptionsControl.value.map((v, i) => `option${i + 1}`),
      ...fields
    ];
    this.dataSource.data = this.variantOptionsControl.value;
  }

  /** Generates product variants **/
  private generateProductVariants() {
    const originalVariants = cloneDeep(this.variantsControl.value);
    const allPossibleVariants = this.allPossibleCases(this.variantOptionsControl.value.filter(vo => vo.values.length).map(v => v.values));
    let newVariants = [];

    if (allPossibleVariants.length) {
      newVariants = allPossibleVariants.map(options => {
        const id = `${this.productForm.value.id}_${options}`;
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
          newVariant.retailPrice = this.productForm.value.retailPrice;
          newVariant.supplyPrice = this.productForm.value.supplyPrice;

          return newVariant;
        }
      });
    }


    const skuValidators = this.readonly ? [] : [ProductValidator.isUniqueSKU(this.productService)];
    const barcodeValidators = this.readonly ? [] : [ProductValidator.isUniqueBarcode(this.productService)];

    const variantsFormGroups = this.fb.array(
      newVariants.map(v => {
        return this.fb.group({
          id: [v.id],
          sku: [v.sku, [], skuValidators],
          barcode: [v.barcode, [], barcodeValidators],
          variantOptionValue1: [v.variantOptionValue1],
          variantOptionValue2: [v.variantOptionValue2],
          variantOptionValue3: [v.variantOptionValue3],
          supplyPrice: [v.supplyPrice],
          retailPrice: [v.retailPrice, Validators.required]
        });
      }));

    this.productForm.setControl('variants', variantsFormGroups);

    this.variantsDataSource.data = newVariants as ProductVariant[];
    // this.variantsDataSource.data = this.productForm.value.variants;
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
    } else {
      return [];
    }
  }


}
