import { Document } from './document';

export class Tax extends Document {
  name: string;
  rate: number;
  constructor() {
    super();
  }
}
