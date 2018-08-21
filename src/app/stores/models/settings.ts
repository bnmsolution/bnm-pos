import { Document } from './document';

export class Settings extends Document {
  // GENERAL
  storeName: string;
  currencyCode: string;
  defaultTaxId: string;
  discountPriceAdjust: string;
  includeTaxInRetailPrice: boolean;

  // REWARDS RELATED
  useReward: boolean;
  rewardRateForCash: number;
  rewardRateForCredit: number;
  mininumPointsToUse: number;
  bounsPointUponRegisteration: number;

  constructor() {
    super();
  }
}