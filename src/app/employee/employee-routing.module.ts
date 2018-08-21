import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddEmployeeComponent } from 'src/app/employee/add-employee/add-employee.component';
import { EditEmployeeResolverService } from 'src/app/employee/edit-employee-resolver.service';

const routes: Routes = [
  {
    path: 'add',
    component: AddEmployeeComponent,
  },
  {
    path: 'edit/:id',
    component: AddEmployeeComponent,
    resolve: {
      editEmployee: EditEmployeeResolverService
    }
  },
  {
    path: '',
    component: EmployeeListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
