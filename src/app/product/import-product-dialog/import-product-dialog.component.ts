import {Component, OnInit} from '@angular/core';
import * as Papa from 'papaparse';
import {parseProducts} from 'pos-models';

@Component({
  selector: 'app-import-product-dialog',
  templateUrl: './import-product-dialog.component.html',
  styleUrls: ['./import-product-dialog.component.scss']
})
export class ImportProductDialogComponent implements OnInit {
  parsedResult;
  parseErrors = [];
  selectedFile: File;

  constructor() {
  }

  ngOnInit() {
  }

  fileChange(e) {
    this.selectedFile = e.target.files[0];
    Papa.parse(this.selectedFile, {
      complete: (results, file) => {
        if (results.errors.length === 0) {
          results.data.shift(); // remove header
          this.parsedResult = parseProducts(results.data, [], [], [], 'testId');
          this.parseErrors = Object.keys(this.parsedResult.errors).map(k => this.parsedResult.errors[k]);
        }
      }
    });
  }
}
