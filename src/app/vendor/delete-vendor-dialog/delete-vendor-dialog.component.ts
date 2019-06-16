import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, Action } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import * as actions from '../../stores/actions/vendor.actions';
import { VendorEffects } from 'src/app/stores/effects/vendor.effects';

@Component({
  selector: 'app-delete-vendor-dialog',
  templateUrl: './delete-vendor-dialog.component.html',
  styleUrls: ['./delete-vendor-dialog.component.scss']
})
export class DeleteVendorDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteVendorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<any>,
    private vendorEffects: VendorEffects) {
  }

  delete() {
    this.vendorEffects.deleteVendor$
      .pipe(
        filter((action: Action) => action.type === actions.DELETE_VENDOR_SUCCESS)
      ).subscribe(() => this.dialogRef.close(true));
    this.store.dispatch(new actions.DeleteVendor(this.data.vendorId));
  }
}
