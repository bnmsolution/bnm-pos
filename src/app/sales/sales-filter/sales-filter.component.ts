import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, Subscription, fromEvent } from 'rxjs';
import { RegisterSaleStatus, Customer } from 'pos-models';

import { SalesFilter, defaultFilter } from '../sales.component';
import { FilterPeriod, getPeriodDates, FilterPeriodChage, Period } from '../../shared/utils/filter-period';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-sales-filter',
  templateUrl: './sales-filter.component.html',
  styleUrls: ['./sales-filter.component.scss']
})
export class SalesFilterComponent implements OnInit {
  @Input() filter$: Subject<SalesFilter>;
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  salesStatus: any = RegisterSaleStatus;
  filterForm: FormGroup;

  filterPeriod: FilterPeriod = FilterPeriod.Today;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService: CustomerService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        const customerId = params.customerId;
        if (customerId) {
          this.customerService.getItemById(customerId)
            .subscribe((customer: Customer) => {
              this.filterForm.patchValue({
                customer
              });
            });
        }
      });
  }

  get dateRange() {
    return { begin: this.filterForm.value.startDate, end: this.filterForm.value.endDate };
  }

  // get period(): any {
  //   return this.filterForm.value.period;
  // }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  createForm() {
    this.filterForm = this.fb.group(defaultFilter);
    this.filterForm.controls.period.valueChanges.subscribe(value => this.periodChange(value));
    this.filterForm.valueChanges.subscribe(values => this.filter$.next(values));
  }

  clearFilter() {
  }

  removeSearchText() {
  }


  isFilterEmpty(): boolean {
    return true;
    // return this.filter === null ||
    //   (this.filter.searchValue.trim().length === 0 && this.filter.categoryId === '' && this.filter.vendorId === '');
  }

  periodChange(change: FilterPeriodChage) {
    this.filterForm.patchValue({
      startDate: change.period.startDate,
      endDate: change.period.endDate
    });
  }
}
