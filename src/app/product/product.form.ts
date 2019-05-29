import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Product } from 'pos-models';
import * as uuid from 'uuid/v1';


import { ProductValidator } from 'src/app/shared/validators/product.validator';
import { ProductService } from 'src/app/core';

export const getProductFrom = (fb: FormBuilder, productService: ProductService, product: Product, readOnly = false) => {

  const skuValidators = readOnly ? [] : [ProductValidator.isUniqueSKU(productService, product ? product.id : null)];
  const barcodeValidators = readOnly ? [] : [ProductValidator.isUniqueBarcode(productService, product ? product.id : null)];

  return {
    _id: null,
    _rev: null,
    id: [uuid()],
    name: ['', Validators.required],
    sku: ['', [], skuValidators],
    barcode: ['', [], barcodeValidators],
    description: '',

    taxId: '',
    categoryId: '',
    vendorId: '',

    supplyPrice: null,
    markup: null,
    retailPrice: [null, Validators.required],
    taxAmount: [{ value: null, disabled: true }],
    productPrice: [{ value: null, disabled: true }],

    trackInventory: false,
    count: [{ value: null, disabled: true }],
    reOrderPoint: [{ value: null, disabled: true }],
    reOrderCount: [{ value: null, disabled: true }],

    variantOptions: fb.array([]),
    variants: fb.array([]),
    addons: fb.array([])
  };
};

/**
 * Creates sub form groups for variant options, variants and addons form arrays.
 * @param fb
 * @param productForm
 * @param product
 */
export const updateProductFromArrays = (fb: FormBuilder, productForm: FormGroup, product: Product) => {
  const variantOptionControls = productForm.controls.variantOptions as FormArray;
  const addonControls = productForm.controls.addons as FormArray;
  const variantControls = productForm.controls.variants as FormArray;

  product.variantOptions.forEach(vo => {
    const variantOptionForm = fb.group({
      name: null,
      values: null
    });
    variantOptionForm.patchValue(vo);
    variantOptionControls.push(variantOptionForm);
  });

  product.variants.forEach(v => {
    const variantForm = getProductVariantForm(fb);
    variantForm.patchValue(v);
    variantControls.push(variantForm);
  });

  product.addons.forEach(ao => {
    const addonForm = fb.group({
      name: null,
      price: null
    });
    addonForm.patchValue(ao);
    addonControls.push(addonForm);
  });
};

export const getProductVariantForm = (fb: FormBuilder) => {
  return fb.group({
    id: null,
    sku: null,
    barcode: null,
    variantOptionValue1: null,
    variantOptionValue2: null,
    variantOptionValue3: null,
    supplyPrice: null,
    retailPrice: [null, Validators.required],
  });
};

