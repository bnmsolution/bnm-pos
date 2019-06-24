import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Category } from 'pos-models';

import * as actions from '../../stores/actions/category.actions';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { DeleteCategoryDialogComponent } from '../delete-category-dialog/delete-category-dialog.component';
import { TableSettings, SortChange } from 'src/app/shared/interfaces/table';

export interface CategoryFilter {
  search: string;
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Category>;
  filter$: Subject<CategoryFilter>;
  displayedColumns = ['name', 'numberOfProducts', 'actions'];
  unsubscribe$ = new Subject();
  tableInitiated = false;

  tableSettings: TableSettings = {
    pageSize: 10,
    sortActive: 'name',
    sortDirection: 'asc'
  };

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<any>) {
    this.filter$ = new Subject();
    this.loadSettings();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.select('categories')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(categories => {
        categories ? this.initTable(categories) : this.store.dispatch(new actions.LoadCategories());
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadSettings() {
    const tableSettings = localStorage.getItem('CategoryListComponent.tableSettings');
    if (tableSettings) {
      this.tableSettings = JSON.parse(tableSettings);
    }
  }

  storeSettings() {
    localStorage.setItem('CategoryListComponent.tableSettings', JSON.stringify(this.tableSettings));
  }

  private initTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.categoryFilterFunction;
    this.dataSource.sortData = this.sortFunction;
    this.dataSource.data = data;
    this.tableInitiated = true;

    this.filter$.subscribe(searchFilter => {
      this.dataSource.filter = JSON.stringify(searchFilter);
    });

    this.paginator.page.subscribe((pageEvent: PageEvent) => {
      this.tableSettings.pageSize = pageEvent.pageSize;
      this.storeSettings();
    });

    this.sort.sortChange.subscribe((sortChange: SortChange) => {
      this.tableSettings.sortActive = sortChange.active;
      this.tableSettings.sortDirection = sortChange.direction;
      this.storeSettings();
    });
  }

  deleteCategory(categoryId: string): void {
    this.dialog
      .open(DeleteCategoryDialogComponent, {
        data: { categoryId },
        autoFocus: false
      })
      .afterClosed()
      .pipe(
        filter(updated => updated),
        tap(() => this.openSnackBar('카테고리가 삭제되었습니다'))
      )
      .subscribe();
  }

  openAddCategoryDialog() {
    this.dialog
      .open(AddCategoryDialogComponent, { autoFocus: false })
      .afterClosed()
      .pipe(
        filter(added => added),
        tap(() => this.openSnackBar('카테고리가 추가되었습니다'))
      )
      .subscribe();
  }

  openEditCategoryDialog(item: Category) {
    this.dialog
      .open(AddCategoryDialogComponent, {
        data: { category: Object.assign({}, item) },
        autoFocus: false
      })
      .afterClosed()
      .pipe(
        filter(updated => updated),
        tap(() => this.openSnackBar('카테고리가 업데이트 되었습니다'))
      )
      .subscribe();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '확인', { duration: 2000 });
  }

  /**
 * Filter function for string search
 * @param category
 * @param searchFilter
 */
  private categoryFilterFunction(category: Category, searchFilter: string): boolean {
    const filterObject: CategoryFilter = JSON.parse(searchFilter);
    return category.name.contains(filterObject.search);
  }


  private sortFunction(data: Category[], sort: MatSort): Category[] {
    const compare = (a, b) => a.trim().localeCompare(b.trim());
    switch (sort.active) {
      case 'name': {
        return sort.direction === 'asc' ? data.sort((a, b) => compare(a.name, b.name)) :
          data.sort((a, b) => compare(b.name, a.name));
      }
      case 'numberOfProducts': {
        return sort.direction === 'asc' ? data.sort((a, b) => a.numberOfProducts - b.numberOfProducts) :
          data.sort((a, b) => b.numberOfProducts - a.numberOfProducts);
      }
      default: return data;
    }
  }
}
