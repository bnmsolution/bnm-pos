import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { WorkerMessenger } from './worker-messenger';

import { environment } from '../../environments/environment';

PouchDB.plugin(PouchDBFind);


interface ChangeInfo {
  direction: string;
  change: {
    docs: any[],
    docs_read: number,
    docs_written: number,
    errors: any[],
    start_time: Date
  };
}

@Injectable()
export class LocalDbService {
  public db: any;
  public remoteDb: any;
  public liveReplicationStarted = false;
  public replicationFilter: any = {
    _id: '_design/app',
    filters: {
      remoteOnly: function (doc) {
        return doc.fromRemote;
      }.toString()
    }
  };

  workerMessenger: WorkerMessenger;

  public replicationStream$ = new Subject<any>();

  constructor() {
    this.workerMessenger = new WorkerMessenger(new Worker('assets/scripts/pouch-worker.js'));
  }

  init(tenantId: string, userName: string): void {
    this.workerMessenger.postMessage('init', [environment.couchdb.remoteUrl, tenantId, userName]);
  }

  /**
   * Replicate data from remote couch database.
   *
   * @returns {Promise<any>}
   */
  public replicate(): Observable<any> {
    return this.workerMessenger.postMessage('replicate', [], 'replication', false);
    // .subscribe((info: ChangeInfo) => {
    //   console.log('replication completed');
    // });
  }

  /**
   * Starts live replication. If any change happens, it will emit document ids.
   */
  public startLiveReplication() {
    this.workerMessenger.postMessage('startLiveReplication', [], 'replication', false)
      .subscribe((info: ChangeInfo) => {
        const changeDocIds = info.change.docs.map(d => d._id);
        this.replicationStream$.next(changeDocIds.join(' '));
      });
  }

  /**
   * Persists a document to local datababse.
   * It will remove version property form the document as a complicit resolve strategy.
   * Only documents with version property will be pushed to the remote database.
   * See DataStoreService.resolveConflicts() for more detail.
   *
   * @param {string} type                 Object's type name
   * @param {*} object                    Object to persist
   * @param {boolean} [offlineMode=false]
   * @returns {Promise<any>}
   */
  public addOrUpdate(type: string, object: any, offlineMode = false): Promise<any> {
    // object._id = this.generateDocId(type, object.id);
    return this.db.get(object._id).then(doc => {
      if (doc) {
        if (doc._rev === object._rev) {
          // adding or updated document is already added or updated by replication.
          console.log('Document already added/updated by sync.');
        } else {
          // updating
          object._rev = doc._rev;
          delete object.version;
          return this.db.put(object).then(data => {
            console.log('document updated. type: %s', type);
            console.log(data);
            return data;
          });
        }
      }
    }).catch(() => {
      delete object.version;
      return this.db.put(object).then(response => {
        console.log('document added. type: %s', type);
        console.log(response);
        return response;
      });
    });
  }

  add(type: string, object: any): Promise<any> {
    return this.db.put(object).then(response => {
      console.log('document added. type: %s', type);
      console.log(response);
      return response;
    });
  }

  public remove(type: string, object: any, offlineMode: boolean = false) {
    const docId = this.generateDocId(type, object.id);
    return this.db.get(docId).then(doc => {
      return this.db.remove(doc);
    }).catch(() => {
      throw new Error('Document does not exist.');
    });
  }

  findAllDocs<T>(docType: string, fromRemote?: boolean): Observable<T[]> {
    return this.workerMessenger.postMessage('findAllDocs', [docType, fromRemote]);
  }

  get<T>(type: string, id: string): Observable<T> {
    const docId: string = this.generateDocId(type, id);
    return this.workerMessenger.postMessage('get', [docId]);
  }

  getByDocId(docId: string) {
    return this.workerMessenger.postMessage('get', [docId]);
  }

  query(viewName: string, options = {}): Observable<any> {
    const promise = this.db.query(`app/${viewName}`, options)
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(err => {
        console.log(err);
      });
    return fromPromise(promise);
  }


  public getHistory(type: string, id: string): any {
    const docId: string = this.generateDocId(type, id);
    return this.remoteDb.get(docId, { revs_info: true, conflicts: true })
      .then(result => {
        const promises: any[] = [];
        result._revs_info.map(revInfo => {
          if (revInfo.status === 'available') {
            promises.push(this.remoteDb.get(docId, { rev: revInfo.rev }));
          }
        });
        return Promise.all(promises);
      });
  }

  public delete<T>(type: string, object: any): any {
    const docId = this.generateDocId(type, object.id);
    return this.db.get(docId).then(doc => {
      return this.db.remove(doc);
    }).catch(() => {
      throw new Error('Document does not exist.');
    });
  }

  private generateDocId(type: string, id: string): string {
    return type + '_' + id;
  }

  /**
   * Resolves conflicts by updating the leaf doc from the remote database
   * and removing all conflict revisions.
   *
   * @private
   * @param {any} doc
   * @param {string[]} conflictsRevs
   *
   * @memberOf DataStoreService
   */
  private resolveConflicts(doc: any, conflictsRevs: string[]): void {
    if (this.remoteDb) {
      this.remoteDb.get(doc._id)
        .then(docFromRemote => {
          // make the remote leaf doc wins over the local leaf doc.
          // winningDocFromRemote._rev = winningDoc._rev;
          return this.remoteDb.put(docFromRemote);
        })
        .then(response => {
          conflictsRevs.map(conflictedRev => {
            this.db.remove(doc._id, conflictedRev)
              .then(removed => {
                console.log(`conflict resolved: ${conflictedRev}`);
              })
              .catch(err => {
                console.log('conflict resolve error');
                console.log(err);
              });
          });
        });
    }
  }
}
