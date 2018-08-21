import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import inputMasks from '../../../shared/constants/input-masks';
import { CustomerService } from '../../../core';
import { Customer } from 'src/app/stores/models/customer';

@Component({
  selector: 'app-add-customer-dialog',
  templateUrl: './add-customer-dialog.component.html',
  styleUrls: ['./add-customer-dialog.component.scss']
})
export class AddCustomerDialogComponent implements OnInit {

  @ViewChild('form') form: NgForm;

  masks = inputMasks;
  name = '';
  phone = '';

  constructor(
    private dialogRef: MatDialogRef<AddCustomerDialogComponent>,
    private customerService: CustomerService) {
  }

  ngOnInit() {
  }

  add() {
    if (this.form.valid) {
      const customer = new Customer();
      customer.name = this.name;
      customer.phone = this.phone;
      // this.customerService.addItem(customer.serialize())
      //   .subscribe(() => {
      //     this.dialogRef.close(customer);
      //   }) ;
    }
  }

}
