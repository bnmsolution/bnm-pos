import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { AuthGuardService, CallbackComponent } from './auth';
import { DashboardComponent } from './dashboard';
import { StoreComponent } from './store/store.component';
import { StoreResolverService } from './services/store.resolver.service';
import { TaxResolverService } from './services/tax-resolver.service';
import { SyncComponent } from './sync/sync.component';
import { SyncGuardService } from './sync/sync-guard.service';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */
      // {
      //   path: 'open-shift',
      //   component: OpenShiftComponent,
      //   canActivate: [AuthGuardService]
      // },
      {
        path: 'callback',
        component: CallbackComponent
      },
      {
        path: 'sync',
        component: SyncComponent
      },
      {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuardService, SyncGuardService],
        children: [
          { path: 'category', loadChildren: 'src/app/category/category.module#CategoryModule' },
          { path: 'product', loadChildren: 'src/app/product/product.module#ProductModule' },
          { path: 'register', loadChildren: 'src/app/register/register.module#RegisterModule' },
          { path: 'sales', loadChildren: 'src/app/sales/sales.module#SalesModule' },
          { path: 'customer', loadChildren: 'src/app/customer/customer.module#CustomerModule' },
          { path: 'employee', loadChildren: 'src/app/employee/employee.module#EmployeeModule' },
          { path: 'vendor', loadChildren: 'src/app/vendor/vendor.module#VendorModule' },
          { path: 'inventory', loadChildren: 'src/app/inventory/inventory.module#InventoryModule' },
          { path: 'report', loadChildren: 'src/app/report/report.module#ReportModule' },
          {
            path: 'settings',
            component: StoreComponent,
            resolve: {
              store: StoreResolverService,
              taxes: TaxResolverService
            }
          },
          {
            path: '',
            component: DashboardComponent
          }
        ]
      },
    ], { enableTracing: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
