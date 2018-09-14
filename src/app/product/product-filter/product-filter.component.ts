import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Category, Vendor} from 'pos-models';

import {ProductFilter} from 'src/app/product';
import {vendorForm} from '../../vendor/vendor.form';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFilterComponent implements OnInit {

  @Input() filter: ProductFilter;
  @Input() filter$: BehaviorSubject<ProductFilter>;
  @Input() filterChange: Subject<any>;
  @Output() clearFilter = new EventEmitter<any>();
  categories: Category[] = [];
  vendors: Vendor[] = [];
  filterForm: FormGroup;
  searchValue$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      search: '',
      categoryId: null,
      vendorId: null
    });
  }


  ngOnInit() {
    // this.searchCtrl = new FormControl();
    // this.searchCtrl.valueChanges.subscribe(val => console.log(val));
    // this.searchValue$
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(() => this.filterChange.next(this.filter));
    //
    // this.filter$.subscribe(filter => {
    //   console.log(filter);
    // });

    this.filterForm.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  isFilterEmpty(): boolean {
    return this.filter === null ||
      (this.filter.searchValue.trim().length === 0 && this.filter.categoryId === '' && this.filter.vendorId === '');
  }
}
