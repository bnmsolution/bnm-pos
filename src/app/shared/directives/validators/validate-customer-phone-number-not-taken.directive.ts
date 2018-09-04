import {Directive} from '@angular/core';
import {AbstractControl, Validator, NG_ASYNC_VALIDATORS} from '@angular/forms';
import {map} from 'rxjs/operators';

import {CustomerService} from '../../../services/customer.service';

@Directive({
  selector: '[appCustomerPhoneNumberNotTaken]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: ValidateCustomerPhoneNumberNotTakenDirective,
      multi: true
    }
  ]
})
export class ValidateCustomerPhoneNumberNotTakenDirective implements Validator {
  constructor(private customerService: CustomerService) {
  }

  validate(control: AbstractControl): { [key: string]: any } {
    console.log(`validating phone number ${control.value}`);
    return new Promise(resolve => {
      if (control.value) {
        // this.isUnique(control.value).then(valid => {
        //   console.log(`resolving validation ${JSON.stringify(valid)}`);
        //   resolve(valid);
        // });
      } else {
        resolve(null);
      }
      control.value ? this.isUnique(control.value) : resolve(null);
    });
  }

  isUnique(value) {
    console.log(`validating phone number ${value}`);
    return this.customerService.isUniquePhoneNumber(value)
      .pipe(
        map(isUnique => {
          return isUnique ? null : { 'takenNumber': true };
        })
      );
  }
}
