import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductViewDialogComponent } from './product-view-dialog.component';

describe('ProductViewDialogComponent', () => {
  let component: ProductViewDialogComponent;
  let fixture: ComponentFixture<ProductViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
