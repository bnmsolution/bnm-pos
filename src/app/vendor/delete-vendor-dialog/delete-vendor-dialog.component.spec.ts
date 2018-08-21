import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVendorDialogComponent } from './delete-vendor-dialog.component';

describe('DeleteVendorDialogComponent', () => {
  let component: DeleteVendorDialogComponent;
  let fixture: ComponentFixture<DeleteVendorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteVendorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVendorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
