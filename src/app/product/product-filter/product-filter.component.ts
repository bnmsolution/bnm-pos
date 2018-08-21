import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Category, Vendor} from 'pos-models';

import {ProductFilter} from 'src/app/product';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {

  @Input() filter: ProductFilter;
  @Input() filterChange: Subject<any>;
  @Input() categories: Category[] = [];
  @Input() vendors: Vendor[] = [];
  @Output() clearFilter = new EventEmitter<any>();

  searchValue$ = new Subject<string>();

  ngOnInit() {
    this.searchValue$
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => this.filterChange.next(this.filter));
  }

  isFilterEmpty(): boolean {
    return this.filter === null ||
      (this.filter.searchValue.trim().length === 0 && this.filter.categoryId === '' && this.filter.vendorId === '');
  }
}
