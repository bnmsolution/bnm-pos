import { Input, Component, OnDestroy, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product, ProductVariant } from 'pos-models';

@Component({
  selector: 'app-variant-list',
  templateUrl: './variant-list.component.html',
  styleUrls: ['./variant-list.component.scss']
})
export class VariantListComponent implements OnInit {

  @Input() product: Product;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<ProductVariant>;
  displayedColumns = ['retailPrice'];

  constructor() { }

  ngOnInit() {
    this.setDisplayColumns();
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.product.variants || [];
  }

  private setDisplayColumns() {
    this.product.variantOptions.forEach((vo, i) => this.displayedColumns.unshift('option' + i));
  }
}
