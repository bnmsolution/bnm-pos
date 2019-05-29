import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryRoutingModule } from './category-routing.module';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { DeleteCategoryDialogComponent } from './delete-category-dialog/delete-category-dialog.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';

@NgModule({
  imports: [
    SharedModule,
    CategoryRoutingModule
  ],
  declarations: [
    CategoryListComponent,
    AddCategoryDialogComponent,
    DeleteCategoryDialogComponent,
    CategoryFilterComponent
  ],
  exports: [
    AddCategoryDialogComponent
  ],
  entryComponents: [
    AddCategoryDialogComponent,
    DeleteCategoryDialogComponent
  ]
})
export class CategoryModule { }
