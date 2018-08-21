import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {merge} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {Customer, CustomerType} from 'pos-models';
import * as uuid from 'uuid/v1';

import * as actions from '../../stores/actions/customer.actions';
import {CustomerEffects} from 'src/app/stores/effects/customer.effects';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html'
})
export class AddCustomerComponent implements OnInit {

  customerForm: FormGroup;
  isNewCustomer = true;
  customer = {} as Customer;
  type = CustomerType;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<any>,
    private customerEffects: CustomerEffects) {
    this.createForm();
  }

  createForm() {
    this.customerForm = this.fb.group({
      id: uuid(),
      type: CustomerType.Individual,
      businessName: null,
      name: '',
      phone: '',
      email: '',
      address: '',
      web: null,
      contactName: null,
      contactPhone: null,
      dateOfJoin: new Date(),
      birthDay: null,
      totalStorePoint: 0,
      currentStorePoint: 0,
      totalSalesCount: 0,
      totalSalesAmount: 0,
      totalReturnsCount: 0
    });
  }

  get customerType() {
    return this.customerForm.get('type').value;
  }

  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        if (data.editCustomer) {
          this.setCustomerForEdit(data.editCustomer);
        }
      });
  }

  setCustomerForEdit(customer) {
    this.isNewCustomer = false;
    this.customer = customer;
    this.customerForm.patchValue(customer);
  }

  onSubmit() {
    Object.assign(this.customer, this.customerForm.value);

    if (this.customerForm.valid) {
      merge(this.customerEffects.addCustomer$, this.customerEffects.updateCustomer$)
        .pipe(
          filter(ac => ac.type === actions.ADD_CUSTOMER_SUCCESS || ac.type === actions.UPDATE_CUSTOMER_SUCCESS),
          take(1)
        )
        .subscribe(ac => {
          const message = ac.type === actions.ADD_CUSTOMER_SUCCESS ? '고객이 추가되었습니다' : '고객이 업데이트 되었습니다';
          this.snackBar.open(message, '확인', {duration: 2000});
          this.router.navigate(['./customer']);
        });

      const action = this.isNewCustomer ?
        new actions.AddCustomer(this.customer) : new actions.UpdateCustomer(this.customer);
      this.store.dispatch(action);
    }
  }
}
