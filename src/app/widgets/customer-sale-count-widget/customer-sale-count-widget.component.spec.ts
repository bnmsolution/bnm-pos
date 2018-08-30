import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSaleCountWidgetComponent } from './customer-sale-count-widget.component';

describe('CustomerSaleCountWidgetComponent', () => {
  let component: CustomerSaleCountWidgetComponent;
  let fixture: ComponentFixture<CustomerSaleCountWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSaleCountWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSaleCountWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
