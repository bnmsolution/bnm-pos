import {Component, OnInit} from '@angular/core';
import * as Papa from 'papaparse';
import {parseProducts} from 'pos-models';
import {forkJoin} from 'rxjs';
import {LocalDbService} from '../../services/localDb.service';
import {AppState} from '../../core';
import {ImportService} from '../../services/import.service';

@Component({
  selector: 'app-import-product-dialog',
  templateUrl: './import-product-dialog.component.html',
  styleUrls: ['./import-product-dialog.component.scss']
})
export class ImportProductDialogComponent implements OnInit {
  parsedResult;
  parseErrors = [];
  selectedFile: File;

  constructor(
    private localDbService: LocalDbService,
    private appState: AppState,
    private importService: ImportService
  ) {
  }

  ngOnInit() {
  }

  fileChange(e) {
    this.selectedFile = e.target.files[0];
    if (this.selectedFile) {
      Papa.parse(this.selectedFile, {
        complete: (results) => {
          if (results.errors.length === 0) {
            results.data.shift(); // remove header
            this.parseData(results.data);
          }
        }
      });
    }
  }

  parseData(data) {
    forkJoin(
      this.localDbService.findAllDocs('product'),
      this.localDbService.findAllDocs('tax'),
      this.localDbService.findAllDocs('category'),
      this.localDbService.findAllDocs('vendor')
    ).subscribe(([products, taxes, categories, vendors]: [any, any, any, any]) => {
      const appState = this.appState.appState$.getValue();
      this.parsedResult = parseProducts(data, products, taxes, categories, vendors, appState.store.id);
      this.parseErrors = Object.keys(this.parsedResult.errors).map(k => this.parsedResult.errors[k]);
    });
  }

  upload() {
    const {products = [], categoriesToCreate: categories = [], vendorsToCreates: vendors = []} = this.parsedResult;
    this.importService.importProducts({
      products, categories, vendors
    }).subscribe();
  }
}
