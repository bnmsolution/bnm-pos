import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerViewDialogComponent } from './customer-view-dialog.component';

describe('CustomerViewDialogComponent', () => {
  let component: CustomerViewDialogComponent;
  let fixture: ComponentFixture<CustomerViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
