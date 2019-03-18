import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountInputsComponent } from './discount-inputs.component';

describe('DiscountInputsComponent', () => {
  let component: DiscountInputsComponent;
  let fixture: ComponentFixture<DiscountInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
