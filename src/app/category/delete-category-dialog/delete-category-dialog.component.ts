import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {filter} from 'rxjs/operators';

import * as actions from '../../stores/actions/category.actions';
import { CategoryEffects } from 'src/app/stores/effects/category.effects';

@Component({
  selector: 'app-delete-category-dialog',
  templateUrl: './delete-category-dialog.component.html',
  styleUrls: ['./delete-category-dialog.component.scss']
})
export class DeleteCategoryDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<any>,
    private categoryEffects: CategoryEffects) {
  }

  delete() {
    this.categoryEffects.deleteCategory$
      .pipe(
        filter(action => action.type === actions.DELETE_CATEGORY_SUCCESS)
      )
      .subscribe(() => this.dialogRef.close(true));
    this.store.dispatch(new actions.DeleteCategory(this.data.categoryId));
  }
}
