import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';

import { LocalDbService, AppState, } from '../core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss']
})
export class SyncComponent implements OnInit {

  repliactionProgress = 0;
  docsWritten: number = null;
  totalDocs: number = null;
  returnUrl = '';
  replicationComplete$ = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localDbService: LocalDbService,
    private messageService: MessageService,
    private appState: AppState
  ) { }

  ngOnInit() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const namespace = environment.auth0.namespace;
    const app_metadata = profile[namespace + 'app_metadata'];
    const tenantId = app_metadata.tenantId;
    this.localDbService.init(tenantId, profile.name);
    this.route.queryParams
      .subscribe(params => this.returnUrl = params['return'] || '/');

    this.replicationComplete$
      .pipe(
        tap(() => this.messageService.init(tenantId)),
        tap(() => this.localDbService.startLiveReplication()),
        switchMap(() => this.appState.inistStore())
      )
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });

    this.startReplication();


    // this.appState.isSynced = true;
    // this.appState.inistStore()
    //   .subscribe(() => {
    //     this.router.navigateByUrl(this.returnUrl);
    //   });
  }

  startReplication() {
    this.localDbService.replicate()
      .subscribe(({ status, info, error }) => {
        switch (status) {
          case 'change': {
            const { docs_written: written, pending } = info;
            this.totalDocs = written + pending;
            this.repliactionProgress = Math.round(written / this.totalDocs * 100);
            break;
          }
          case 'complated': {
            this.repliactionProgress = 100;
            this.appState.isSynced = true;
            this.replicationComplete$.next('');
            this.replicationComplete$.complete();
          }
        }
      });
  }

}
