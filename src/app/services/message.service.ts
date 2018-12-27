import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import io from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable()
export class MessageService {
  tenantId: string;
  saleMessage: any;

  init(tenantId: string) {
    const accessToken = localStorage.getItem('access_token');
    this.tenantId = tenantId;
    this.saleMessage = io.connect(`${environment.posMessagingUrl}?token=${accessToken}`);
  }

  sendMessage(message: any) {
    this.saleMessage.emit('sale', JSON.stringify(message));
  }
}
