import { ChangeDetectionStrategy, Component, EventEmitter, ElementRef, Input, OnInit, ViewChild, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CategoryFilter } from 'src/app/category';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFilterComponent implements OnInit {

  @Input() filter$: Subject<CategoryFilter>;
  @Output() addCategory = new EventEmitter();
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
