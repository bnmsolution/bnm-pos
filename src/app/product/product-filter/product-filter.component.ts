import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Category, Vendor } from 'pos-models';

import { ProductFilter } from 'src/app/product';
import { CategoryService } from '../../services/category.service';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  @Input() filter$: Subject<ProductFilter>;
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  categories: Category[] = [];
  vendors: Vendor[] = [];
  filterForm: FormGroup;
  bodyKeyPressSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private vendorService: VendorService,
  ) {
    this.filterForm = this.fb.group({
      search: '',
      categoryId: '',
      vendorId: ''
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filter$.next(value);
      });

    forkJoin(
      this.route.queryParams.pipe(take(1)),
      this.categoryService.getAll(),
      this.vendorService.getAll()
    )
      .subscribe(([params, categories, vendors]) => {
        this.categories = categories;
        this.vendors = vendors;
        this.filterForm.patchValue({
          search: '',
          categoryId: params.category || '',
          vendorId: params.vendor || ''
        });
        this.filter$.next(this.filterForm.value);
      });

    /** Allows typing or scanning without input focus */
    this.bodyKeyPressSubscription = fromEvent(document, 'keypress')
      .subscribe((e: any) => {
        if (e.target.tagName !== 'INPUT') {
          this.searchInput.nativeElement.focus();
          this.filterForm.patchValue({ search: e.key });
          e.preventDefault();
        }
      });
  }

  ngOnDestroy() {
    this.bodyKeyPressSubscription.unsubscribe();
  }

  removeSearchText() {
    this.filterForm.patchValue({
      search: ''
    });
  }

  clearFilter() {
    this.filterForm.patchValue({
      search: '',
      categoryId: '',
      vendorId: ''
    });
  }

  isFilterEmpty(): boolean {
    const value = this.filterForm.value;
    return value.search.trim().length === 0 && value.categoryId === '' && value.vendorId === '';
  }
}
