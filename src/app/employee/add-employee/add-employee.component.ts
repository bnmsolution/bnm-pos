import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgForm} from '@angular/forms';
import {Store} from '@ngrx/store';
import {merge} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {Employee} from 'pos-models';
import * as uuid from 'uuid/v1';


import * as actions from '../../stores/actions/employee.actions';
import {EmployeeEffects} from 'src/app/stores/effects/employee.effects';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employee: Employee = {
    id: uuid()
  } as Employee;
  isNewEmployee = true;
  @ViewChild('form', { static: false }) form: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<any>,
    private employeeEffets: EmployeeEffects) {
  }

  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        if (data.editEmployee) {
          console.log(data.editEmployee);
          this.employee = data.editEmployee;
          this.isNewEmployee = false;
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      merge(this.employeeEffets.addEmployee$, this.employeeEffets.updateEmployee$)
        .pipe(
          filter(action1 => action1.type === actions.ADD_EMPLOYEE_SUCCESS || action1.type === actions.UPDATE_EMPLOYEE_SUCCESS),
          take(1)
        )
        .subscribe(action2 => {
          const message = action2.type === actions.ADD_EMPLOYEE_SUCCESS ? '직원이 추가되었습니다' : '직원이 업데이트 되었습니다';
          this.snackBar.open(message, '확인', {duration: 2000});
          this.router.navigate(['./employee']);
        });

      const action = this.isNewEmployee ?
        new actions.AddEmployee(this.employee) : new actions.UpdateEmployee(this.employee);
      this.store.dispatch(action);
    }
  }
}
