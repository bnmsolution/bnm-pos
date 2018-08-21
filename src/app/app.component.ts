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
  ['previewIcon', 'outline-find_in_page-24px']
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
  }

  ngOnInit() {
    this.addSvgIcons();
    // this.auth.loggedIn$
    //   .filter(loggedIn => loggedIn)
    //   .subscribe(() => this.startLiveReplication());
  }

  private addSvgIcons(): void {
    svgIconList.forEach(icon => {
      this.iconRegistry.addSvgIcon(
        icon[0],
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${icon[1]}.svg`));
    });
  }

  private startLiveReplication(): void {
    this.localDbService.init(this.auth.userProfile.tenantId);
    this.localDbService.startLiveReplication(this.auth.userProfile.tenantId);
  }
}
