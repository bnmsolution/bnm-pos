importScripts('pouchdb-7.0.0.min.js');
// todo: using node env
const remoteCouchUrl = 'http://13.124.188.143:5984/';

// const remoteCouchUrl = 'http://localhost:5984/';

class PouchWorker {
  init(messageId, tenantId, username) {
    this.db = new PouchDB(`db-${tenantId}`, {auto_compaction: true, revs_limit: 1});
    this.remoteDb = new PouchDB(`http://ec2-35-183-130-127.ca-central-1.compute.amazonaws.com:5984/db-${tenantId}`, {
      auth: {
        username,
        password: tenantId
      }
    });
  }

  /**
   * Fetchs multiple documents in a range, indexed and sorted by the _id.
   *
   * @template T
   * @param {string} messageId
   * @param {string} docType
   * @returns {Observable<T[]>}
   */
  findAllDocs(messageId, docType) {
    this.db.allDocs({
      include_docs: true,
      conflicts: true,     // only local db
      startkey: docType + '_',    // doc id start with [docType]_
      endkey: docType + '\uffff'  // a largest possible character
    })
      .then(result => {
        const docs = result.rows.map(row => {
          // if (row.doc.hasOwnProperty('_conflicts') && row.doc._conflicts.length > 0) {
          //   this.resolveConflicts(row.doc, row.doc._conflicts);
          // }
          return row.doc;
        });
        postMessage({
          messageId,
          data: docs
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  get(messageId, docId) {
    return this.db.get(docId)
      .then(doc => {
        postMessage({
          messageId,
          data: doc
        });
      })
      .catch(() => {
        postMessage({
          messageId,
          data: null
        });
      });
  }

  replicate(messageId) {
    this.db.replicate.from(this.remoteDb, {
      batch_size: 500,
      filter: doc => doc.fromRemote || doc._deleted === true
    }).on('change', info => {
      this.logReplicationStatus('change', info);
    }).on('paused', err => {
      this.logReplicationStatus('paused', err);
    }).on('active', () => {
      this.logReplicationStatus('active');
    }).on('complete', () => {
      this.logReplicationStatus('complete');
    }).on('denied', err => {
      this.logReplicationStatus('denied', err);
    }).on('error', err => {
      this.logReplicationStatus('error', err);
    });
  }

  startLiveReplication(messageId, remoteCouchUrl, tenantId) {
    if (this.liveReplicationStarted) return;

    const remoteDbUrl = remoteCouchUrl + 'db-' + tenantId;
    this.liveReplicationStarted = true;
    this.db.sync(remoteDbUrl, {
      live: true,
      retry: true,
      filter: doc => doc.fromRemote || doc._deleted === true
    }).on('change', info => {
      this.logReplicationStatus('change', info);
      // postMessage({
      //   messageId,
      //   data: info
      // });
    }).on('paused', err => {
      this.logReplicationStatus('paused', err);
    }).on('active', () => {
      this.logReplicationStatus('active');
    }).on('complete', () => {
      this.logReplicationStatus('complete');
    }).on('denied', err => {
      this.logReplicationStatus('denied', err);
    }).on('error', err => {
      this.logReplicationStatus('error', err);
    });
  }

  logReplicationStatus(status, obj) {
    console.group(`[DataStoreService] Live Replication ${status}.`);
    if (obj) console.log(obj);
    console.groupEnd();
  }
}

const db = new PouchWorker();

onmessage = (message) => {
  if (message.data instanceof Object && message.data.hasOwnProperty('method') && message.data.hasOwnProperty('args')) {
    db[message.data.method].apply(db, message.data.args);
  }
};
