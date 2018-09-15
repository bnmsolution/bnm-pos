import {NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatToolbarModule,
  MatTabsModule,
  MatDialogModule,
  MatRadioModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatIconModule,
  MatChipsModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatRippleModule,
  MatProgressSpinnerModule,
  MatPaginatorIntl,
  MatMenuModule,
  MatBadgeModule,
  MatProgressBarModule
} from '@angular/material';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';

const modules = [
  // CDK
  A11yModule,
  BidiModule,
  ObserversModule,
  OverlayModule,
  PlatformModule,
  PortalModule,
  ScrollDispatchModule,
  CdkStepperModule,
  CdkTableModule,

  // Material
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatToolbarModule,
  MatTabsModule,
  MatDialogModule,
  MatRadioModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatIconModule,
  MatChipsModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatRippleModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatBadgeModule,
  MatProgressBarModule,
  // date range modules
  SatDatepickerModule,
  SatNativeDateModule
];

import {MatPaginatorIntlKo} from 'src/app/intl/MatPaginatorIntlKo';

@NgModule({
  imports: modules,
  exports: modules,
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlKo
    }
  ],
})
export class PosMaterialModule {
}
