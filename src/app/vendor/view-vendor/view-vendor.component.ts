import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {vendorForm} from '../vendor.form';

@Component({
  selector: 'app-view-vendor',
  templateUrl: '../vendor.form.html'
})
export class ViewVendorComponent implements OnInit {

  vendorForm: FormGroup;
  title = '거래처 정보';
  formType = 'view';
  readonly = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        this.vendorForm.patchValue(data.vendor);
      });
  }

  createForm() {
    this.vendorForm = this.fb.group(vendorForm);
    this.vendorForm.disable();
  }

  onSubmit() {
  }
}
