import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {InventoryTransactionType} from 'pos-models';
import {InventoryFilter} from '../inventory-list/inventory-list.component';
import {FilterPeriod, getPeriodDates} from '../../shared/utils/filter-period';


@Component({
  selector: 'app-inventory-filter',
  templateUrl: './inventory-filter.component.html',
  styleUrls: ['./inventory-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryFilterComponent implements OnInit, OnDestroy {
  @Input() filter$: Subject<InventoryFilter>;
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  types = InventoryTransactionType;
  filterForm: FormGroup;
  period = FilterPeriod;
  bodyKeyPressSubscription: Subscription;

  constructor(
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: '',
      transactionType: InventoryTransactionType.All,
      period: FilterPeriod.All,
      startDate: new Date(),
      endDate: new Date()
    });
  }

  get dateRange() {
    const value = this.filterForm.value;
    return {begin: value.startDate, end: value.endDate};
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.setPeriod(value);
        this.filter$.next(value);
      });

    /** Allows typing or scanning without input focus */
    this.bodyKeyPressSubscription = fromEvent(document, 'keypress')
      .subscribe((e: any) => {
        if (e.target.tagName !== 'INPUT') {
          this.searchInput.nativeElement.focus();
          this.filterForm.patchValue({search: e.key});
          e.preventDefault();
        }
      });
  }

  ngOnDestroy() {
    this.bodyKeyPressSubscription.unsubscribe();
  }

  setPeriod(filter: InventoryFilter) {
    if (filter.period !== FilterPeriod.Custom) {
      const {startDate, endDate} = getPeriodDates(filter.period);
      filter.startDate = startDate;
      filter.endDate = endDate;
      this.filterForm.patchValue({startDate, endDate}, {emitEvent: false});
    }
  }

  changeDate(value) {
    const {begin, end} = value;
    this.filterForm.patchValue({startDate: begin, endDate: end});
  }

  removeSearchText() {
    this.filterForm.patchValue({
      search: ''
    });
  }

  clearFilter() {
    this.filterForm.patchValue({
      search: '',
      type: ''
    });
  }

  isFilterEmpty(): boolean {
    const value = this.filterForm.value;
    return value.search.trim().length === 0 && value.type === '';
  }
}
