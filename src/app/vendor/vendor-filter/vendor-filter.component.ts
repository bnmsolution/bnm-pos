import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { VendorFilter } from 'src/app/vendor';


@Component({
  selector: 'app-vendor-filter',
  templateUrl: './vendor-filter.component.html',
  styleUrls: ['./vendor-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorFilterComponent implements OnInit {

  @Input() filter$: Subject<VendorFilter>;
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: ''
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
  }

  removeSearchText() {
    this.filterForm.patchValue({
      search: ''
    });
  }

  clearFilter() {
    this.filterForm.patchValue({
      search: ''
    });
  }

  isFilterEmpty(): boolean {
    const value = this.filterForm.value;
    return value.search.trim().length === 0;
  }
}
