import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { Tax, PosStore } from 'pos-models';

import { supportedCurrencies } from '../shared/constants/currencies';
import * as actions from 'src/app/stores/actions/store.actions';
import { StoreEffects } from 'src/app/stores/effects/store.effects';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  posStore: PosStore;
  storeForm: FormGroup;
  selectedTabIndex = 0;
  taxes = [];
  currencies = supportedCurrencies;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private storeEffects: StoreEffects,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) {
    this.createFrom();
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { store: PosStore[], taxes: Tax[] }) => {
        if (data.store) {
          this.taxes = data.taxes;
          this.posStore = data.store[0];
          this.storeForm.patchValue(data.store[0]);
        }
      });
  }

  createFrom() {
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      currencyCode: ['', Validators.required],
      displayCurrencySymbol: [false],
      defaultTaxId: ['', Validators.required],
      totalPriceAdjust: 'noAdjust',

      useReward: false,
      rewardRateForCash: null,
      rewardRateForCredit: null,
      minimumPointsToUse: null,
      bonusPointUponRegistration: null,

      address: '',
      phoneNumber: '',
      businessNumber: '',
      representative: ''
    });

    this.storeForm.controls.useReward.valueChanges
      .subscribe(value => {
        if (value) {
          this.storeForm.controls.rewardRateForCash.enable();
          this.storeForm.controls.rewardRateForCredit.enable();
          this.storeForm.controls.minimumPointsToUse.enable();
          this.storeForm.controls.bonusPointUponRegistration.enable();
        } else {
          this.storeForm.controls.rewardRateForCash.disable();
          this.storeForm.controls.rewardRateForCredit.disable();
          this.storeForm.controls.minimumPointsToUse.disable();
          this.storeForm.controls.bonusPointUponRegistration.disable();
        }
      });
  }


  // temporary fix for [Tabs] Hidden tabs don't render expansion panels correctly
  // https://github.com/angular/material2/issues/5269
  tabChange(event) {
    Promise.resolve().then(() => this.selectedTabIndex = event.index);
  }

  onSubmit(): void {
    const store = Object.assign({}, this.posStore, this.storeForm.value);

    if (this.storeForm.valid) {
      this.storeEffects.updateStore$
        .pipe(
          filter(action => action.type === actions.UPDATE_STORE_SUCCESS),
          take(1)
        ).subscribe(() => {
          this.snackBar.open('설정이 저장되었습니다', '확인', { duration: 2000 });
        });
      this.store.dispatch(new actions.UpdateStore(store));
    }
  }
}
