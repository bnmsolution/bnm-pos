import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { CallbackComponent } from './callback.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CallbackComponent
  ],
  exports: [
    CallbackComponent
  ],
  providers: [
    AuthService,
    AuthGuardService
  ]
})
export class AuthModule { }
