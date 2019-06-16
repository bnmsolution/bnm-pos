import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, Action } from '@ngrx/store';
import { merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Vendor } from 'pos-models';

import { vendorForm } from '../vendor.form';
import * as actions from '../../stores/actions/vendor.actions';
import { VendorEffects } from 'src/app/stores/effects/vendor.effects';

@Component({
  selector: 'app-add-vendor',
  templateUrl: '../vendor.form.html'
})
export class AddVendorComponent implements OnInit {

  vendorForm: FormGroup;
  vendor = {} as Vendor;
  isNewVendor = true;
  readonly = false;
  formType = 'add';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<any>,
    private vendorEffects: VendorEffects) {
    this.createForm();
  }

  get title(): string {
    return this.isNewVendor ? '거래처 추가' : '거래처 수정';
  }

  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        if (data.vendor) {
          this.setVendorForEdit(data.vendor);
        }
      });
  }

  createForm() {
    this.vendorForm = this.fb.group(vendorForm);
  }

  onSubmit() {
    Object.assign(this.vendor, this.vendorForm.value);

    if (this.vendorForm.valid) {
      merge(this.vendorEffects.addVendor$, this.vendorEffects.updateVendor$)
        .pipe(
          filter((action1: Action) => action1.type === actions.ADD_VENDOR_SUCCESS || action1.type === actions.UPDATE_VENDOR_SUCCESS),
          take(1)
        )
        .subscribe(action2 => {
          const message = action2.type === actions.ADD_VENDOR_SUCCESS ? '거래처가 추가되었습니다' : '거래처가 업데이트 되었습니다';
          this.snackBar.open(message, '확인', { duration: 2000 });
          this.router.navigate(['./vendor']);
        });

      const action = this.isNewVendor ?
        new actions.AddVendor(this.vendor) : new actions.UpdateVendor(this.vendor);
      this.store.dispatch(action);
    }
  }

  private setVendorForEdit(vendor: Vendor) {
    this.vendor = vendor;
    this.isNewVendor = false;
    this.vendorForm.patchValue(this.vendor);
    this.formType = 'edit';
  }
}
