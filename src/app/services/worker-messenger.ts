import {Observable, Subject} from 'rxjs';
import * as uuid from 'uuid/v1';


export class WorkerMessenger {
  messageMap = {};

  constructor(private worker: Worker) {
    this.worker.onmessage = eventMessage => {
      const {messageId, data} = eventMessage.data;

      if (this.messageMap.hasOwnProperty(messageId)) {
        const {subject, isSingleResponse} = this.messageMap[messageId];
        subject.next(data);
        if (isSingleResponse) {
          subject.complete();
          delete this.messageMap[messageId];
        }
      }
    };
  }

  postMessage(method: string, args: any[] = [], messageId = uuid(), isSingleResponse = true): Observable<any> {
    const subject = new Subject();

    args.unshift(messageId);
    this.worker.postMessage({
      method,
      args
    });

    this.messageMap[messageId] = {
      subject,
      isSingleResponse
    };
    return subject.asObservable();
  }
}
