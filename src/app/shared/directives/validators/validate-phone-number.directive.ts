import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

import { CustomerService } from '../../../services/customer.service';

@Directive({
  selector: '[appCustomerPhoneNumberNotTaken]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidatePhoneNumberDirective,
      multi: true
    }
  ]
})

export class ValidatePhoneNumberDirective implements Validator {
  constructor(private customerService: CustomerService) { }

  validate(control: AbstractControl): { [key: string]: any } {
    console.log(`validating phone number ${control.value}`);
    // return control.value ? this.customerService.isUniquePhoneNumber(control.value) : null;
    return {};
  }
}
