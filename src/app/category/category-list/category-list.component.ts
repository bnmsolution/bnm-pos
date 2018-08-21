import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Store} from '@ngrx/store';
import {filter, tap} from 'rxjs/operators';
import {Category} from 'pos-models';

import * as actions from '../../stores/actions/category.actions';
import {AddCategoryDialogComponent} from '../add-category-dialog/add-category-dialog.component';
import {DeleteCategoryDialogComponent} from '../delete-category-dialog/delete-category-dialog.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewInit {
  dataSource: any;
  displayedColumns = ['name', 'numberOfProducts', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<any>) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.select('categories')
      .subscribe(categories => {
        this.dataSource.data = categories || [];
      });
    this.store.dispatch(new actions.LoadCategories());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  deleteCategory(categoryId: string): void {
    this.dialog
      .open(DeleteCategoryDialogComponent, {
        data: {categoryId}
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
        data: {category: Object.assign({}, item)}
      })
      .afterClosed()
      .pipe(
        filter(updated => updated),
        tap(() => this.openSnackBar('카테고리가 업데이트 되었습니다'))
      )
      .subscribe();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '확인', {duration: 2000});
  }
}
