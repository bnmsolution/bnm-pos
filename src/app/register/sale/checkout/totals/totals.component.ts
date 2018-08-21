import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {RegisterSale} from 'pos-models';

@Component({
  selector: 'app-totals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent {
  @Input() sale: RegisterSale;

  openedSection: string;
  discountRate: number;

  openSection(section: string) {
    this.openedSection = this.openedSection === section ? undefined : section;
  }
}
