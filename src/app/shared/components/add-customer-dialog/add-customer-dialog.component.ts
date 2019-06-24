import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, Action } from '@ngrx/store';
import { merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Customer } from 'pos-models';
import * as moment from 'moment';

import { getCustomerForm } from '../../../customer/customer.form';
import * as actions from '../../../stores/actions/customer.actions';
import { CustomerEffects } from 'src/app/stores/effects/customer.effects';
import { CustomerService } from 'src/app/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


export interface AddCustomerDialogData {
  customer: Customer;
}

@Component({
  selector: 'app-add-customer-dialog',
  templateUrl: './add-customer-dialog.component.html',
  styleUrls: ['./add-customer-dialog.component.scss']
})
export class AddCustomerDialogComponent {

  customerForm: FormGroup;
  isNewCustomer = true;
  customer = {} as Customer;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddCustomerDialogData,
    private snackBar: MatSnackBar,
    private store: Store<any>,
    private customerService: CustomerService,
    private customerEffects: CustomerEffects) {
    this.createForm();
    if (data && data.customer) {
      this.initEditCustomer(data.customer);
    }
  }

  get title(): string {
    return this.isNewCustomer ? '고객 추가' : '고객 수정';
  }

  createForm() {
    this.customerForm = this.fb.group(getCustomerForm(this.customerService));
    this.customerForm.controls.dateOfBirth.valueChanges
      .subscribe(value => {
        if (value) {
          const yearToday = moment().year();
          const yearAtBirth = moment(value).year();
          const ageGroup = Math.floor((yearToday - yearAtBirth) / 10) * 10;
          this.customerForm.controls.ageGroup.setValue(ageGroup);
        }
      });
  }

  initEditCustomer(customer: Customer) {
    this.isNewCustomer = false;
    this.customer = customer;
    this.customerForm.patchValue(customer);
  }

  onSubmit() {
    Object.assign(this.customer, this.customerForm.value);

    if (this.customerForm.valid) {
      merge(this.customerEffects.addCustomer$, this.customerEffects.updateCustomer$)
        .pipe(
          filter((ac: Action) => ac.type === actions.ADD_CUSTOMER_SUCCESS || ac.type === actions.UPDATE_CUSTOMER_SUCCESS),
          take(1)
        )
        .subscribe(ac => {
          const message = ac.type === actions.ADD_CUSTOMER_SUCCESS ? '고객이 추가되었습니다' : '고객이 업데이트 되었습니다';
          this.snackBar.open(message, '확인', { duration: 2000 });
          this.dialogRef.close(this.customer);
        });

      const action = this.isNewCustomer ?
        new actions.AddCustomer(this.customer) : new actions.UpdateCustomer(this.customer);
      this.store.dispatch(action);
    }
  }

}
