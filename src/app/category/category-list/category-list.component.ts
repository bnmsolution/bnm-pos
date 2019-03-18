import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Category } from 'pos-models';

import * as actions from '../../stores/actions/category.actions';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { DeleteCategoryDialogComponent } from '../delete-category-dialog/delete-category-dialog.component';

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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<any>) {
    this.filter$ = new Subject();
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

  private initTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.categoryFilterFunction;
    this.dataSource.data = data;
    this.tableInitiated = true;
    this.filter$.subscribe(searchFilter => {
      this.dataSource.filter = JSON.stringify(searchFilter);
    });
  }

  deleteCategory(categoryId: string): void {
    this.dialog
      .open(DeleteCategoryDialogComponent, {
        data: { categoryId }
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
      .open(AddCategoryDialogComponent)
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
        data: { category: Object.assign({}, item) }
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
}
