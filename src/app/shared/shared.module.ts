import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { TextMaskModule } from 'angular2-text-mask';

import { MenuComponent } from '../menu';
import { MainToolbarComponent } from '../main-toolbar';
import { ToggleSectionComponent, ToggleSectionDirective } from '../menu/toggle';
import { LinkMenuComponent } from '../menu/link';
import { CreateContentHeaderComponent, CommonPageHeaderComponent, EmailWithOptionsComponent } from '../shared/components';
import {
  AppCurrencyFormatterDirective,
  DroppableDirective,
  InputDescriptionDirective,
  DraggableDirective,
  ValidateCustomerPhoneNumberNotTakenDirective
} from '../shared/directives';
import { AppCurrencyPipe, AppDatePipe } from '../shared/pipes';
import { LayoutComponent } from '../layout/layout.component';
import { PosMaterialModule } from '../app.material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CdkDetailRowDirective } from './directives/cdk-detail-row/cdk-detail-row.directive';
import { RecentSalesComponent } from './components/recent-sales/recent-sales.component';
import { ValidatePhoneNumberDirective } from './directives/validators/validate-phone-number.directive';
import { NumericPadComponent } from './components/numeric-pad/numeric-pad.component';
import { ProductValidator } from './validators/product.validator';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PosMaterialModule,
    // TextMaskModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PosMaterialModule,
    // TextMaskModule,

    // Components
    MenuComponent,
    MainToolbarComponent,
    ToggleSectionComponent,
    LinkMenuComponent,
    CreateContentHeaderComponent,
    CommonPageHeaderComponent,
    EmailWithOptionsComponent,
    LayoutComponent,
    ConfirmDialogComponent,
    RecentSalesComponent,
    NumericPadComponent,

    // Directives
    ToggleSectionDirective,
    AppCurrencyFormatterDirective,
    DraggableDirective,
    DroppableDirective,
    InputDescriptionDirective,
    ValidateCustomerPhoneNumberNotTakenDirective,
    CdkDetailRowDirective,

    // Pipes
    AppCurrencyPipe,
    AppDatePipe
  ],
  declarations: [
    // Components
    MenuComponent,
    MainToolbarComponent,
    ToggleSectionComponent,
    LinkMenuComponent,
    CreateContentHeaderComponent,
    CommonPageHeaderComponent,
    EmailWithOptionsComponent,
    LayoutComponent,
    ConfirmDialogComponent,
    RecentSalesComponent,
    NumericPadComponent,
    NumericPadComponent,

    // Directives
    ToggleSectionDirective,
    AppCurrencyFormatterDirective,
    DraggableDirective,
    DroppableDirective,
    InputDescriptionDirective,
    ValidateCustomerPhoneNumberNotTakenDirective,
    CdkDetailRowDirective,
    ValidatePhoneNumberDirective,

    // Pipes
    AppCurrencyPipe,
    AppDatePipe,

  ],
  providers: [
    ProductValidator
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule {
}
