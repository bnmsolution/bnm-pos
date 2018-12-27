import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Product } from 'pos-models';

@Component({
  selector: 'app-product-addons',
  templateUrl: './product-addons.component.html',
  styleUrls: ['./product-addons.component.scss']
})
export class ProductAddonsComponent implements OnInit {
  @Input() product: Product;
  @Input() readonly: boolean;

  displayedColumns: string[] = ['name', 'price', 'actions'];
  dataSource: MatTableDataSource<any>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.product.addons);
  }

  addAddon() {
    this.product.addons.push({ name: '', price: null });
    this.dataSource.data = this.product.addons;
  }

  removeAddon(index) {
    this.product.addons = this.product.addons.filter((v, i) => i !== index);
    this.dataSource.data = this.product.addons;
  }

}
