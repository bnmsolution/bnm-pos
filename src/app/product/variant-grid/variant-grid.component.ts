import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// import { Variant } from 'src/app/product/models/variant';
// import { VariantOption } from 'src/app/product/models/variantOption';

@Component({
  selector: 'app-variant-grid',
  templateUrl: './variant-grid.component.html',
  styleUrls: ['./variant-grid.component.scss']
})
export class VariantGridComponent implements OnInit, OnChanges {

  // @Input() variants: Variant[];
  // @Input() variantOptions: VariantOption[];
  // @Input() trackInventory: boolean;
  // @Input() readOnly = false;
  //
  // private data: Variant[];
  // private pageSize = 10;
  // private skip = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

}
