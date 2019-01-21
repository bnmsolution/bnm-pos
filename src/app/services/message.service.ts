import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import io from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable()
export class MessageService {
  tenantId: string;
  socket: any;
  message$ = new Subject();

  init(tenantId: string) {
    const accessToken = localStorage.getItem('access_token');
    this.tenantId = tenantId;
    this.socket = io.connect(`${environment.posMessagingUrl}?token=${accessToken}&tenantId=${tenantId}&source=pos`);
    this.socket.on('pos', event => this.message$.next(event));
  }

  sendMessage(message: any) {
    this.socket.emit('sale', JSON.stringify(message));
  }
}
