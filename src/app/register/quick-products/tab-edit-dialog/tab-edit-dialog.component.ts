import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegisterTab } from 'pos-models';

@Component({
  selector: 'app-tab-edit-dialog',
  templateUrl: './tab-edit-dialog.component.html',
  styleUrls: ['./tab-edit-dialog.component.scss']
})
export class TabEditDialogComponent {
  tabs: RegisterTab[] = [];

  constructor(public dialogRef: MatDialogRef<TabEditDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.tabs = data.tabs;
  }

  addTab() {
    // todo: adding maximum tab constant
    if (this.tabs.length < 5) {
      this.tabs.push(new RegisterTab('새탭'));
    }
  }

  removeTab(index) {
    this.tabs.splice(index, 1);
  }

  update() {
    this.dialogRef.close(this.tabs);
  }
}
