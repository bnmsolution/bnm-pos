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
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RegisterSale, RegisterSaleStatus, canHoldSale, canVoidSale } from 'pos-models';
import { LineItemComponent } from './line-item/line-item.component';
import { CustomerViewDialogComponent } from '../../../customer/customer-view-dialog/customer-view-dialog.component';
import { CustomerService } from '../../../services/customer.service';
import { CustomerQuickEditDialogComponent } from '../../customer-quick-edit-dialog/customer-quick-edit-dialog.component';
import { DiscountDialogComponent } from './discount-dialog/discount-dialog.component';
import { AddCustomerDialogComponent } from 'src/app/shared/components/add-customer-dialog/add-customer-dialog.component';


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
  @Output() updateLineItemAddons = new EventEmitter();

  @ViewChild('lineItems', { static: false }) lineItems: ElementRef;
  @ViewChildren('li') lineItemComponents: QueryList<LineItemComponent>;
  @ViewChild('quantityEdit', { static: false }) quantityEditComponent: ElementRef;

  openedLineItemId: string;
  isNoteOpen: boolean;
  note: string;
  salesStatus: any = RegisterSaleStatus;

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService) {
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

  openAddCustomerDialog() {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent);
    dialogRef.afterClosed().subscribe(customer => {
      if (customer) {
        // this.customerAdded.emit(customer);
      }
    });
  }

  openCustomerInfoDialog(customerId: string) {
    this.customerService.getItemById(customerId)
      .subscribe(customer => {
        // this.dialog.open(CustomerViewDialogComponent, {
        //   data: {
        //     customer: customer
        //   }
        // });
        this.dialog.open(CustomerQuickEditDialogComponent, {
          autoFocus: false,
          data: customer
        });
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
