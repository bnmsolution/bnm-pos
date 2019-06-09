import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { RegisterQuickProduct } from 'pos-models';

@Component({
  selector: 'app-quick-product',
  templateUrl: './quick-product.component.html',
  styleUrls: ['./quick-product.component.scss']
})
export class QuickProductComponent implements OnInit {
  @Input() quickProduct: RegisterQuickProduct;
  @Input() isSelected = false;
  @Input() showEmpty = true;
  @Input() draggable = true;
  @Output() quickProductClick = new EventEmitter<RegisterQuickProduct>();
  @Output() quickProductDrop = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  onClick() {
    this.quickProductClick.emit(this.quickProduct);
  }

  onDrop(srcQuickProduct: RegisterQuickProduct, targetQuickProduct: RegisterQuickProduct) {
    if (srcQuickProduct.position === targetQuickProduct.position) {
      return;
    }
    this.quickProductDrop.emit({
      srcQuickProduct,
      targetQuickProduct
    });
  }

  /***
   * Return total number of group members.
   * @returns {number}
   */
  getNonEmptyMemberCount(): number {
    return this.quickProduct.members.filter(m => m.isSingle()).length;
  }

  /**
   * Finds an empty spot in the members.
   * @returns {number} Index of empty spot.
   */
  findEmptyQuickProductMemberIndex(): number {
    return this.quickProduct.members.findIndex(m => m.isEmpty());
  }

}
