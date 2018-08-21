import { Document } from './document';

export class Category extends Document {
  name: string;
  numberOfProducts: number;
  constructor() {
    super();
  }
}
