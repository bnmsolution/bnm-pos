import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByTimeComponent } from './sales-by-time.component';

describe('SalesByTimeComponent', () => {
  let component: SalesByTimeComponent;
  let fixture: ComponentFixture<SalesByTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesByTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesByTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
