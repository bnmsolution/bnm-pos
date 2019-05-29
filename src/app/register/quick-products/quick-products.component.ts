import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { RegisterTab, RegisterQuickProduct } from 'pos-models';

@Component({
  selector: 'app-quick-products',
  templateUrl: './quick-products.component.html',
  styleUrls: ['./quick-products.component.scss']
})
export class QuickProductsComponent implements OnInit {
  @Input() selectedTabIndex = 0;
  @Input() selectedPosition = -1;
  @Input() registerTabs: RegisterTab[] = [];
  @Input() showEmpty = true;
  @Output() clicked = new EventEmitter<RegisterQuickProduct>();
  @Output() dropped = new EventEmitter<any>();
  @Output() selectedPositionChange = new EventEmitter<number>();
  @Output() tabChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  handleQuickProductClick(quickProduct: RegisterQuickProduct): void {
    this.selectedPosition = quickProduct.position;
    this.selectedPositionChange.emit(quickProduct.position);

    if (this.clicked) {
      this.clicked.emit(quickProduct);
    }
  }

  handleQuickProductDrop({ srcQuickProduct, targetQuickProduct }): void {
    if (this.dropped) {
      this.dropped.emit({ srcQuickProduct, targetQuickProduct });
    }
  }

  handleTabChange(event) {
    this.tabChange.emit(event.index);
  }

}
