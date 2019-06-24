import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CurrencyMaskModule } from 'ng2-currency-mask';

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
import { PeriodSelectComponent } from './components/period-select/period-select.component';
import { GroupBySelectComponent } from './components/group-by-select/group-by-select.component';
import { CreateContentFooterComponent } from './components/create-content-footer/create-content-footer.component';
import { AddCustomerDialogComponent } from './components/add-customer-dialog/add-customer-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PosMaterialModule,
    CurrencyMaskModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PosMaterialModule,
    CurrencyMaskModule,
    // Components
    MenuComponent,
    MainToolbarComponent,
    ToggleSectionComponent,
    LinkMenuComponent,
    CreateContentHeaderComponent,
    CreateContentFooterComponent,
    CommonPageHeaderComponent,
    EmailWithOptionsComponent,
    LayoutComponent,
    ConfirmDialogComponent,
    RecentSalesComponent,
    NumericPadComponent,
    PeriodSelectComponent,
    GroupBySelectComponent,

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
    AppDatePipe,

    AddCustomerDialogComponent
  ],
  declarations: [
    // Components
    MenuComponent,
    MainToolbarComponent,
    ToggleSectionComponent,
    LinkMenuComponent,
    CreateContentHeaderComponent,
    CreateContentFooterComponent,
    CommonPageHeaderComponent,
    EmailWithOptionsComponent,
    LayoutComponent,
    ConfirmDialogComponent,
    RecentSalesComponent,
    NumericPadComponent,
    NumericPadComponent,
    PeriodSelectComponent,
    GroupBySelectComponent,

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

    //
    AddCustomerDialogComponent
  ],
  providers: [
    ProductValidator
  ],
  entryComponents: [
    ConfirmDialogComponent,
    AddCustomerDialogComponent
  ]
})
export class SharedModule {
}
