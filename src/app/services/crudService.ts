import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import { map} from 'rxjs/operators';

import {HttpService} from './http.service';
import {LocalDbService} from './localDb.service';

export abstract class CrudService {
  serviceName: string;

  constructor(
    private _localDbService: LocalDbService,
    private _httpService: HttpService,
    private documentName: string) {
    this.serviceName = `[${documentName} service]`;
  }

  getAll({fromRemoteDb}: { fromRemoteDb?: boolean } = {}): Observable<any[]> {
    return this._localDbService.findAllDocs(this.documentName, fromRemoteDb);
  }

  getItemById(id: string): Observable<any> {
    return this._localDbService.get(this.documentName, id);
  }

  addItem(doc: any): Observable<any> {
    doc.created = new Date().toISOString();
    doc._id = this.generateDocId(doc.id);
    return this._httpService.post(this.documentName, doc)
      .pipe(
        map((response: any) => {
          console.log(`${this.serviceName} Added ${this.documentName} to back-end(${response.id})`);
          doc._rev = response.rev;
          return doc;
        })
      );
  }

  updateItem(doc: any, id: string = null): Observable<any> {
    doc.updated = new Date().toISOString();
    return this._httpService.put(this.documentName, doc, id)
      .pipe(
        map((response: any) => {
          console.log(`${this.serviceName} Updated ${this.documentName} to back-end(${doc.id})`);
          doc._rev = response.rev;
          return doc;
        })
      );
  }

  deleteItem(id: string): Observable<string> {
    return this._httpService.delete(this.documentName, id)
      .pipe(
        map((response: any) => {
          console.log(`${this.serviceName} Deleted ${this.documentName} to back-end(${id})`);
          return id;
        })
      );
  }

  // getHistory(docId: string): Promise<any> {
  //   return this._localDbService.getHistory(this.documentName, docId);
  // }

  /**
   * Generating document id for couch/pouch databases.
   * @private
   * @param {string} id
   * @returns {string}
   * @memberof DataStoreService
   */
  generateDocId(id: string): string {
    return this.documentName + '_' + id;
  }

  getChangeStream() {
    return this._localDbService.replicationStream$;
  }
}
