import {Validators} from '@angular/forms';
import * as uuid from 'uuid/v1';

export const vendorForm = {
  id: uuid(),
  name: ['', Validators.required],
  ownerName: '',
  businessNumber: '',
  businessType1: '',
  businessType2: '',
  address: '',
  phone: '',
  fax: '',
  email: '',
  web: '',
  description: ''
};
