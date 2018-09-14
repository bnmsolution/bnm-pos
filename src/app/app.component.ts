import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

import {AuthService} from './auth/auth.service';
import {LocalDbService} from './core';

const svgIconList = [
  ['toogleIcon', 'ic_keyboard_arrow_up_24px'],
  ['backspaceIcon', 'ic_keyboard_backspace_24px'],
  ['editIcon', 'outline-create-24px'],
  ['closeIcon', 'ic_close_24px'],
  ['addCustomerIcon', 'ic_person_add_24px'],
  ['customerIcon', 'ic_person_24px'],
  ['deleteIcon', 'outline-delete-24px'],
  ['holdIcon', 'ic_schedule_24px'],
  ['giftcardIcon', 'ic_card_giftcard_24px'],
  ['creditCardIcon', 'ic_credit_card_24px'],
  ['localAtmIcon', 'ic_local_atm_24px'],
  ['loyaltyIcon', 'ic_loyalty_24px'],
  ['printIcon', 'ic_print_24px'],
  ['moreVertIcon', 'ic_more_vert_24px'],
  ['addIcon', 'ic_add_24px'],
  ['listIcon', 'ic_list_24px'],
  ['searchIcon', 'ic_search_24px'],
  ['replayIcon', 'ic_replay_24px'],
  ['emailIcon', 'ic_email_24px'],
  ['undoIcon', 'ic_undo_24px'],
  ['redoIcon', 'ic_redo_24px'],
  ['cancelIcon', 'ic_cancel_24px'],
  ['openInNewIcon', 'ic_open_in_new_24px'],
  ['settingIcon', 'ic_settings_24px'],
  ['uploadIcon', 'ic_file_upload_24px'],
  ['downloadIcon', 'ic_file_download_24px'],
  ['viewListIcon', 'outline-view_headline-24px'],
  ['previewIcon', 'outline-find_in_page-24px'],
  ['exit', 'outline-exit_to_app-24px'],
  ['setting', 'outline-settings-24px'],
  ['help', 'outline-help_outline-24px'],
  ['notification', 'outline-notifications-24px'],
  ['arrowUp', 'outline-arrow_upward-24px'],
  ['arrowDown', 'outline-arrow_downward-24px'],
  ['menu', 'outline-menu-24px'],
  ['account', 'outline-account_circle-24px']
];

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',

})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private localDbService: LocalDbService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    this.addSvgIcons();
    this.auth.profile$
      .subscribe(profile => {
        if (profile) {
          this.startLiveReplication(profile);
        }
      });
  }

  private addSvgIcons(): void {
    svgIconList.forEach(icon => {
      this.iconRegistry.addSvgIcon(
        icon[0],
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${icon[1]}.svg`));
    });
  }

  private startLiveReplication({tenantId}): void {
    this.localDbService.init(tenantId);
    this.localDbService.startLiveReplication(tenantId);
  }
}
