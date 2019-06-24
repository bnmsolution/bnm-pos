import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { AppState } from '../../../services/app.service';

@Pipe({
  name: 'appDate'
})
export class AppDatePipe implements PipeTransform {

  constructor(private appState: AppState) {
  }

  transform(value: string, format: string): string {
    if (value) {
      const date = moment(value);
      if (format) {
        return date.format(format);
      } else {
        return date.format(this.appState.currentStore.dateFormat);
      }
    }
    return '-';
  }

}
