import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {filter} from 'rxjs/operators';

import * as actions from '../../stores/actions/employee.actions';
import {EmployeeEffects} from 'src/app/stores/effects/employee.effects';

@Component({
  selector: 'app-delete-employee-dialog',
  templateUrl: './delete-employee-dialog.component.html',
  styleUrls: ['./delete-employee-dialog.component.scss']
})
export class DeleteEmployeeDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<any>,
    private employeeEffects: EmployeeEffects) {
  }

  delete() {
    this.employeeEffects.deleteEmployee$
      .pipe(
        filter(action => action.type === actions.DELETE_EMPLOYEE_SUCCESS)
      )
      .subscribe(() => this.dialogRef.close(true));
    this.store.dispatch(new actions.DeleteEmployee(this.data.employeeId));
  }
}
