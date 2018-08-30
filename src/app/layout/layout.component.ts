import {Component, OnInit} from '@angular/core';
import {MenuMode, MenuService} from '../services/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  sidenavWidth;
  constructor(private menuService: MenuService) {
  }

  ngOnInit() {
    this.menuService.menuMode$.subscribe((mode: MenuMode) => {
      this.sidenavWidth = mode === MenuMode.Full ? '150px' : '';
    });
  }

}
