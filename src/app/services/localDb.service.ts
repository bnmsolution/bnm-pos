import {Injectable, NgZone} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import PouchDB from 'pouchdb';
// import WorkerPouch from 'worker-pouch';
// PouchDB.plugin(WorkerPouch);
// PouchDB.adapter('worker', require('worker-pouch'));

// todo: using node env
const remoteCouchUrl = 'http://13.124.188.143:5984/';

// const remoteCouchUrl = 'http://localhost:5984/';

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

  public replicationStream$ = new Subject<any>();

  constructor(private zone: NgZone) {
    console.log('LocalDbService');
  }

  init(tenantId: string): void {
    // this.db = new PouchDB('pos-db', { adapter: 'worker', auto_compaction: true, revs_limit: 1 });
    this.db = new PouchDB(`db-${tenantId}`, {auto_compaction: true, revs_limit: 1});
    this.connectRemoteDb(tenantId);
  }

  public connectRemoteDb(tenantId: string): void {
    const remoteDbUrl: string = remoteCouchUrl + 'db-' + tenantId;
    this.remoteDb = new PouchDB(remoteDbUrl);
    // this.remoteDb.put(this.replicationFilter);
    console.log('[LocalDbService] Connected to the remote database.');
  }

  /**
   * Replicate data from remote couch database.
   *
   * @param {string} tenantId
   * @returns {Promise<any>}
   */
  public replicate(tenantId: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      const remoteDbUrl: string = remoteCouchUrl + 'db-' + tenantId;
      this.db.replicate.from(remoteDbUrl, {
        filter: doc => doc.fromRemote || doc._deleted === true
      })
        .on('change', info => {
          console.log('[DataStoreService] Replication changed.');
          console.log(info);
        }).on('paused', err => {
        console.log('[DataStoreService] Replication paused.');
        console.log(err);
      }).on('active', () => {
        console.log('[DataStoreService] Replication active.');
      }).on('denied', err => {
        console.log('[DataStoreService] Replication denied.');
        console.log(err);
      })
        .on('complete', info => {
          console.log('[DataStoreService] Replication completed.');
          console.log(info);
          resolve();
        }).on('error', err => {
        console.error('[DataStoreService] Replication error =>');
        console.error(err);
        reject();
      });
    });
    return promise;
  }

  /**
   * Starts live replication. If any change made, it will notify it to all DataCacheSerivce.
   *
   *
   * @param {string} tenantId
   * @returns {void}
   */
  public startLiveReplication(tenantId: string): void {
    // return;
    if (this.liveReplicationStarted) {
      return;
    }

    // if (!this.remoteDb) {
    //   this.connectRemoteDb(tenantId);
    // }

    const remoteDbUrl: string = remoteCouchUrl + 'db-' + tenantId;
    this.liveReplicationStarted = true;
    this.db.sync(remoteDbUrl, {
      live: true,
      retry: true,
      filter: doc => doc.fromRemote || doc._deleted === true
    })
      .on('change', info => {
        console.log('[DataStoreService] Live Replication changed.');
        const changeDocIds = info.change.docs.map(d => d._id);
        this.zone.run(() => {
          this.replicationStream$.next(changeDocIds.join(' '));
        });
      }).on('paused', err => {
      console.log('[DataStoreService] Live Replication paused.');
      console.log(err);
    }).on('active', () => {
      console.log('[DataStoreService] Live Replication active.');
    }).on('denied', err => {
      console.log('[DataStoreService] Live Replication denied.');
      console.log(err);
    })
      .on('complete', info => {
        console.log('[DataStoreService] Live Replication completed.');
        console.log(info);
      }).on('error', err => {
      console.error('[DataStoreService] Live Replication error =>');
      console.error(err);
    });
    console.log('[DataStoreService] Live Replication started.');
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

  /**
   * Fetchs multiple documents in a range, indexed and sorted by the _id.
   *
   * @template T
   * @param {string} docType
   * @returns {Observable<T[]>}
   */
  public findAllDocs<T>(docType: string, fromRemote: boolean = false): Observable<any> {
    const targetDb = fromRemote ? this.remoteDb : this.db;
    const promise = targetDb.allDocs({
      include_docs: true,
      conflicts: !fromRemote,     // only local db
      startkey: docType + '_',    // doc id start with [docType]_
      endkey: docType + '\uffff'  // a largest possilbe character
    })
      .then(result => {
        return result.rows.map(row => {
          // if (row.doc.hasOwnProperty('_conflicts') && row.doc._conflicts.length > 0) {
          //   this.resolveConflicts(row.doc, row.doc._conflicts);
          // }
          return row.doc;
        });
      })
      .catch(function (err) {
        console.log(err);
      });

    return fromPromise(promise);
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

  public get(type: string, id: string): any {
    const docId: string = this.generateDocId(type, id);
    return this.db.get(docId)
      .catch(err => null);
  }

  public getHistory(type: string, id: string): any {
    const docId: string = this.generateDocId(type, id);
    return this.remoteDb.get(docId, {revs_info: true, conflicts: true})
      .then(result => {
        const promises: any[] = [];
        result._revs_info.map(revInfo => {
          if (revInfo.status === 'available') {
            promises.push(this.remoteDb.get(docId, {rev: revInfo.rev}));
          }
        });
        return Promise.all(promises);
      });
  }

  public findById<T>(type: string, id: string): any {
    return this.db.rel.find(type, id);
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
