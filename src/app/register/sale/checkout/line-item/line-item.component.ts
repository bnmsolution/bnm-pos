import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {distinctUntilChanged} from 'rxjs/operators';
import {RegisterSaleLineItem} from 'pos-models';

import {ProductService} from 'src/app/core';
import {ProductViewDialogComponent} from '../../../product-view-dialog/product-view-dialog.component';

@Component({
  selector: 'app-line-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss']
})
export class LineItemComponent implements OnInit, OnChanges {
  @Input() lineItem: RegisterSaleLineItem;
  @Input() isOpen: boolean;
  @Input() isReturn = false;
  @Input() maxReturnQuantity: number;
  @Output() lineItemClick = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() update = new EventEmitter();

  lineItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private productService: ProductService) {

  }

  ngOnChanges(simpleChange) {
    if (simpleChange.lineItem && this.lineItemForm) {
      const {quantity, retailPrice, discountRate} = this.lineItem;
      // We don't want to trigger valueChanges event
      // Input changes was made by form value change(this.lineItemForm.valueChanges)
      this.lineItemForm.setValue({quantity, retailPrice, discountRate}, {emitEvent: false});
    }
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const {quantity, retailPrice, discountRate} = this.lineItem;
    const quantityValidator = this.isReturn ? Validators.min(-this.maxReturnQuantity) : Validators.min(1);
    this.lineItemForm = this.fb.group({
      quantity: [quantity, [Validators.required, quantityValidator]],
      retailPrice: [{value: retailPrice, disabled: this.isReturn}, [Validators.required, Validators.min(0)]],
      discountRate: [{value: discountRate, disabled: this.isReturn}, [Validators.min(0), Validators.max(100)]],
    });

    this.lineItemForm.valueChanges
      .pipe(
        // temporary fix for Angular bug
        // Number input fires valueChanges twice https://github.com/angular/angular/issues/12540
        // this only fix when user types, using arrow key still fires change event twice
        distinctUntilChanged()
      )
      .subscribe(values => {
        if (this.lineItemForm.valid) {
          this.update.emit({
            id: this.lineItem.id,
            ...values
          });
        }
      });
  }

  handleClick() {
    this.lineItemClick.emit({id: this.lineItem.id});
  }

  handleRemoveClick(event) {
    // prevent click event
    event.stopPropagation();
    this.remove.emit({id: this.lineItem.id});
  }

  openProductViewDialog(): void {
    this.productService.getProductById(this.lineItem.productId)
      .subscribe(product => {
        this.dialog.open(ProductViewDialogComponent, {
          width: '650px',
          data: {
            product: product
          }
        });
      });
  }
}
