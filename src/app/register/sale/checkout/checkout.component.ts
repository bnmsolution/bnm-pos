import {
  Component,
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {MatDialog} from '@angular/material';

import {RegisterSale, RegisterSaleStatus, canHoldSale, canVoidSale} from 'pos-models';
import {AddCustomerDialogComponent} from '../add-customer-dialog/add-customer-dialog.component';
import {LineItemComponent} from './line-item/line-item.component';

@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements AfterViewInit {

  @Input() sale: RegisterSale;
  @Output() pay = new EventEmitter();
  @Output() hold = new EventEmitter();
  @Output() void = new EventEmitter();
  @Output() removeCustomer = new EventEmitter();
  @Output() addCustomer = new EventEmitter();
  @Output() removeLineItem = new EventEmitter();
  @Output() updateLineItem = new EventEmitter();

  @ViewChild('lineItems') lineItems: ElementRef;
  @ViewChildren('li') lineItemComponents: QueryList<LineItemComponent>;

  openedLineItemId: string;
  isNoteOpen: boolean;
  note: string;
  salesStatus: any = RegisterSaleStatus;

  constructor(
    private dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.lineItemComponents.changes.subscribe(() => this.scrollToBottom());
  }

  get buttonLabels() {
    const defaultLabels = ['판매보류', '판매취소'];
    if (this.sale) {
      switch (this.sale.status) {
        case RegisterSaleStatus.Open: {
          return defaultLabels;
        }
        case RegisterSaleStatus.Return: {
          return ['환불보류', '환불취소'];
        }
        case RegisterSaleStatus.Exchange: {
          return ['교환보류', '교환취소'];
        }
        default:
          return defaultLabels;
      }
    } else {
      return defaultLabels;
    }
  }


  toggleNote() {
    this.isNoteOpen = !this.isNoteOpen;
  }

  openLineItemDetail(lineItemId: string): void {
    this.openedLineItemId = this.openedLineItemId === lineItemId ? null : lineItemId;
  }

  openAddCustomerDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent);
    dialogRef.afterClosed().subscribe(customer => {
      if (customer) {
        // this.customerAdded.emit(customer);
      }
    });
  }

  // tracking fucntion for lineItems ngFor
  lineItemTrack(index, item) {
    return item.id;
  }

  holdable() {
    return canHoldSale(this.sale);
  }

  voidable() {
    return canVoidSale(this.sale);
  }

  isValid() {
    if (this.lineItemComponents) {
      return this.lineItemComponents.toArray().filter(c => c.lineItemForm.valid === false).length === 0;
    }
    return false;
  }

  isReturnItem(productId: string): boolean {
    if (this.sale.status === RegisterSaleStatus.Return) {
      return this.sale.originalLineItems.find(l => l.productId === productId) !== undefined;
    }
    return false;
  }

  getMaxReturnQuantity(productId: string): number {
    if (this.sale.status === RegisterSaleStatus.Return) {
      return this.sale.originalLineItems
        .filter(l => l.productId === productId)
        .map(l => l.quantity)
        .reduce((a, b) => a + b, 0);
    }
  }

  scrollToBottom() {
    try {
      this.lineItems.nativeElement.scrollTop = this.lineItems.nativeElement.scrollHeight;
    } catch (err) {
    }
  }
}
