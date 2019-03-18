import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Product, ProductAddon } from 'pos-models';
import { cloneDeep } from 'src/app/shared/utils/lang';

@Component({
  selector: 'app-product-addons',
  templateUrl: './product-addons.component.html',
  styleUrls: ['./product-addons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductAddonsComponent implements OnInit {
  @Input() product: Product;
  @Input() readonly: boolean;

  addons: ProductAddon[];

  displayedColumns: string[] = ['name', 'price', 'actions'];
  dataSource: MatTableDataSource<any>;

  ngOnInit() {
    this.addons = cloneDeep(this.product.addons);
    this.dataSource = new MatTableDataSource(this.addons);
  }

  addAddon() {
    this.addons.push({ name: '', price: null });
    this.dataSource.data = this.addons;
  }

  removeAddon(index) {
    this.addons = this.addons.filter((v, i) => i !== index);
    this.dataSource.data = this.addons;
  }
}
