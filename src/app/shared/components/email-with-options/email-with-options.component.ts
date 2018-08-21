import { Component, Input, Output, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/material';

@Component({
  selector: 'app-email-with-options',
  templateUrl: './email-with-options.component.html',
  styleUrls: ['./email-with-options.component.scss']
})
export class EmailWithOptionsComponent implements OnChanges {

  @Input() email: string;
  @Output() emailChange: EventEmitter<string> = new EventEmitter<string>();

  public commonDomains = [
    'naver.com',
    'daum.com',
    'gmail.com',
    'nate.com',
    'hotmail.com',
    'yahoo.com'
  ];

  private address = '';
  private domain = '';
  private domainOption = '';

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.email.currentValue) {
      this._parseEmail(changes.email.currentValue);
    }
  }

  onAddressChange(value: string) {
    this.address = value;
    this._propagateChanges();
  }

  onDomainChange(value: string) {
    this.domain = value;
    this._propagateChanges();
  }

  /**
   * Splits email into address and domain parts and sets the model value.
   * @param email
   */
  private _parseEmail(email: string): void {
    const arr: any = email.split('@');
    this.address = arr[0];
    this.domain = arr[1];
    this.domainOption = this.commonDomains.indexOf(arr[1]) > -1 ? arr[1] : '';
  }

  /** Invoked when an option is clicked. */
  private _onOptionChange(change: MatSelectChange): void {
    if (change.value !== '') {
      this.domain = change.value;
    }
    this._propagateChanges();
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(): void {
    this.emailChange.emit(this.address + '@' + this.domain);
  }

}
