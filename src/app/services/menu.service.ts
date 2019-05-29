import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

export enum MenuMode {
  Full, Mini
}

@Injectable()
export class MenuService {
  public sections: any[];
  public registerSections: any[];
  public openedSection: any;
  public currentPage: any;
  public currentSection: any;
  public eventStream$: Subject<MenuMode>;

  menuMode$: BehaviorSubject<any>;

  constructor(private router: Router) {
    this.menuMode$ = new BehaviorSubject(MenuMode.Full);
    this.sections = [{
      name: '대시보드',
      icon: 'outline-dashboard-24px',
      type: 'link',
      url: '/'
    },
    {
      name: '레지스터',
      icon: 'outline-shopping_basket-24px',
      type: 'link',
      url: '/register'
    },
    {
      name: '판매내역',
      icon: 'outline-history-24px',
      type: 'link',
      url: '/sales'
    },
    {
      name: '리포트',
      icon: 'outline-assessment-24px',
      type: 'link',
      url: '/report'
    },
    {
      name: '상품',
      icon: 'outline-card_giftcard-24px',
      type: 'link',
      url: '/product'
    },
    {
      name: '거래처',
      icon: 'outline-local_shipping-24px',
      type: 'link',
      url: '/vendor'
    },
    {
      name: '카테고리',
      icon: 'outline-local_offer-24px',
      type: 'link',
      url: '/category'
    },
    // {
    //   name: '상품관리',
    //   icon: 'ic_card_giftcard_24px',
    //   type: 'toggle',
    //   pages: [
    //     {
    //       name: '상품',
    //       type: 'link',
    //       url: '/product'
    //     },
    //     {
    //       name: '거래처',
    //       type: 'link',
    //       url: '/vendor'
    //     },
    //     {
    //       name: '카테고리',
    //       type: 'link',
    //       url: '/category'
    //     }
    //   ]
    // },
    // {
    //   name: '재고관리',
    //   icon: 'ic_account_balance_24px',
    //   type: 'toggle',
    //   pages: [
    //     {
    //       name: '재고',
    //       type: 'link',
    //       url: '##/product'
    //     },
    //     {
    //       name: '재고 카운트',
    //       type: 'link',
    //       url: '##/vendor'
    //     }
    //   ]
    // },
    {
      name: '고객관리',
      icon: 'outline-person_outline-24px',
      type: 'link',
      url: '/customer'
    },
    {
      name: '직원관리',
      icon: 'outline-supervisor_account-24px',
      type: 'link',
      url: '/employee'
    },
    {
      name: '설정',
      icon: 'outline-settings-24px',
      type: 'link',
      url: '/settings'
    }];

    this.registerSections = [
      {
        name: '판매중',
        icon: 'ic_shopping_cart_24px',
        type: 'link',
        url: '/register'
      },
      {
        name: '판매기록',
        icon: 'ic_history_24px',
        type: 'link',
        url: '/sales'
      },
      {
        name: '설정',
        icon: 'ic_settings_24px',
        type: 'link',
        url: '/register/configuration'
      },
    ];

    this.router.events
      .subscribe((event) => {
      });
    this.eventStream$ = new Subject<any>();
  }

  public onNavigationEnd(url: string): void {
    // this.isRegisterMenu = path === "/register";
    const matchPage = (section, page) => {
      if (url.indexOf(page.url) !== -1) {
        this.selectSection(section);
        this.selectPage(section, page);
      }
    };

    this.sections.forEach(section => {
      if (section.pages) {
        section.pages.forEach(page => {
          matchPage(section, page);
        });
      } else if (section.type === 'link') {
        matchPage(section, section);
      }
    });
  }

  public selectSection(section) {
    this.openedSection = section;
    this.notifyEvent({
      event: 'sectionSelected',
      section
    });
  }

  public toggleSelectSection(section) {
    this.openedSection = (this.openedSection === section ? null : section);
    this.notifyEvent({
      event: 'sectionSelected',
      section: this.openedSection
    });
  }

  public isSectionSelected(section) {
    return this.openedSection === section;
  }

  public selectPage(section, page) {
    this.currentSection = section;
    this.currentPage = page;
    this.notifyEvent({
      event: 'pageSelected',
      section,
      page
    });
  }

  public isPageSelected(page) {
    return this.currentPage === page;
  }

  toggleMenuMode() {
    const mode = this.menuMode$.getValue();
    this.menuMode$.next(mode === MenuMode.Full ? MenuMode.Mini : MenuMode.Full);
  }

  private notifyEvent(event: any): void {
    this.eventStream$.next(event);
  }

}
