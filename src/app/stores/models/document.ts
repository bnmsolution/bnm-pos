import { Guid } from '../../shared/utils/guid';

export class Document {
  _id: string;
  _rev: string;

  id: string;
  created: Date;
  createdBy: string;
  updatedBy: string;
  lastUpdated: Date;
  activated = true;

  constructor() {
    this.id = Guid.newGuid();
    this.setDocumentId();
  }

  setDocumentId() {
    const className = this.constructor.name;
    const prefix = className.charAt(0).toLowerCase() + className.slice(1);
    this._id = prefix + '_' + this.id;
  }

  copy() {
    return JSON.parse(JSON.stringify(this));
  }
}
