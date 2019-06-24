import { Injectable } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

@Injectable()
export class PosDateAdaptor extends MomentDateAdapter {
  constructor() {
    super('ko');
  }

  format(date: moment.Moment, displayFormat: string): string {
    return date.locale('ko').format(displayFormat);
  }
}
