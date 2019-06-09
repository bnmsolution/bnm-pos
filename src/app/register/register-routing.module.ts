import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterSaleComponent } from './sale/register-sale.component';
import { RegisterConfigComponent } from './register-config/register-config.component';
import { CanDeactivateGuard } from '../shared/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: RegisterSaleComponent,
    // resolve: {
    //   resultSet: RegisterResolverService
    // }
  },
  // {
  //   path: 'return/:id',
  //   component: RegisterSaleComponent,
  //   canActivate: [ShiftGuardService]
  // },
  {
    path: 'configuration',
    component: RegisterConfigComponent,
    // canActivate: [RegisterConfigGuardService],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {
}
