import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { DeleteEmployeeDialogComponent } from './delete-employee-dialog/delete-employee-dialog.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeResolverService } from 'src/app/employee/edit-employee-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    EmployeeRoutingModule
  ],
  declarations: [
    EmployeeListComponent,
    AddEmployeeComponent,
    DeleteEmployeeDialogComponent
  ],
  providers: [
    EditEmployeeResolverService
  ],
  entryComponents: [
    DeleteEmployeeDialogComponent
  ]
})
export class EmployeeModule { }
