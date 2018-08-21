import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import {filter, take} from 'rxjs/operators';
import {Tax, Settings} from 'pos-models';

import { supportedCurrencies } from '../shared/constants/currencies';
import * as actions from 'src/app/stores/actions/settings.actions';
import { SettingsEffects } from 'src/app/stores/effects/settings.effects';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings: Settings;
  settingsForm: FormGroup;
  selectedTabIndex = 0;
  taxes = [];
  currencies = supportedCurrencies;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private settingsEffects: SettingsEffects,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) {
    this.createFrom();
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { settings: Settings[], taxes: Tax[] }) => {
        if (data.settings) {
          this.taxes = data.taxes;
          this.settings = data.settings[0];
          this.settingsForm.patchValue(data.settings[0]);
        }
      });
  }

  createFrom() {
    this.settingsForm = this.fb.group({
      storeName: ['', Validators.required],
      currencyCode: ['', Validators.required],
      defaultTaxId: ['', Validators.required],
      discountPriceAdjust: '',

      useReward: false,
      rewardRateForCash: null,
      rewardRateForCredit: null,
      mininumPointsToUse: null,
      bounsPointUponRegisteration: null
    });

    this.settingsForm.controls.useReward.valueChanges
      .subscribe(value => {
        if (value) {
          this.settingsForm.controls.rewardRateForCash.enable();
          this.settingsForm.controls.rewardRateForCredit.enable();
          this.settingsForm.controls.mininumPointsToUse.enable();
          this.settingsForm.controls.bounsPointUponRegisteration.enable();
        } else {
          this.settingsForm.controls.rewardRateForCash.disable();
          this.settingsForm.controls.rewardRateForCredit.disable();
          this.settingsForm.controls.mininumPointsToUse.disable();
          this.settingsForm.controls.bounsPointUponRegisteration.disable();
        }
      });
  }


  // temporary fix for [Tabs] Hidden tabs don't render expansion panels correctly
  // https://github.com/angular/material2/issues/5269
  tabChange(event) {
    Promise.resolve().then(() => this.selectedTabIndex = event.index);
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.settingsEffects.updateSettings$
        .pipe(
          filter(action => action.type === actions.UPDATE_SETTINGS_SUCCESS),
          take(1)
        ).subscribe(() => {
          this.snackBar.open('설정이 저장되었습니다', '확인', { duration: 2000 });
        });
      this.store.dispatch(new actions.UpdateSettings(this.settings));
    }
  }
}
