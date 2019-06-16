import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Category } from 'pos-models';
import * as uuid from 'uuid/v1';

import * as actions from '../../stores/actions/category.actions';
import { CategoryEffects } from 'src/app/stores/effects/category.effects';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent {
  category: Category = {
    id: uuid()
  } as Category;
  isNewCategory = true;
  @ViewChild('form', { static: false }) form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<any>,
    private categoryEffets: CategoryEffects) {
    if (data && data.category) {
      this.isNewCategory = false;
      this.category = data.category;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      merge(this.categoryEffets.addCategory$, this.categoryEffets.updateCategory$)
        .pipe(
          filter(ac => ac.type === actions.ADD_CATEGORY_SUCCESS || ac.type === actions.UPDATE_CATEGORY_SUCCESS)
        )
        .subscribe(() => this.dialogRef.close(this.category));

      const action = this.isNewCategory ?
        new actions.AddCategory(this.category) : new actions.UpdateCategory(this.category);
      this.store.dispatch(action);
    }
  }
}
