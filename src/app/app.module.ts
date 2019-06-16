import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, ActionReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


// import { CurrencyMaskModule } from 'ng2-currency-mask';
// import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { WidgetsModule } from './widgets/widgets.module';
import { DashboardComponent } from './dashboard';
import { StoreComponent } from './store/store.component';


import { reducers, metaReducers, getInitialState } from './stores/reducers';
import { effects } from './stores/effects';
import { SyncComponent } from './sync/sync.component';
import { SyncGuardService } from './sync/sync-guard.service';
import { ReportModule } from './report/report.module';


// export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
//   align: 'left',
//   allowNegative: true,
//   allowZero: true,
//   decimal: '.',
//   precision: 0,
//   prefix: '',
//   suffix: '',
//   thousands: ','
// };


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StoreComponent,
    SyncComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    CoreModule,
    SharedModule,
    AppRoutingModule,
    // CurrencyMaskModule,
    AuthModule,
    WidgetsModule,
    ReportModule,
    // CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: environment.cloudinary.cloud_name } as CloudinaryConfiguration)
    StoreModule.forRoot(reducers, { metaReducers, initialState: getInitialState, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
    EffectsModule.forRoot(effects),

  ],
  providers: [
    // { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: COMPOSITION_BUFFER_MODE, useValue: false },
    SyncGuardService
  ],
  // Dialog components must be inculded in entryComponents list.
  // Check https://material.angular.io/components/dialog/overview for the detail
  entryComponents: [
    // SingleProductEditDialogComponent,
    // GroupProductEditDialogComponent,
    // ProductViewDialogComponent,
    // VariantSelectDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
