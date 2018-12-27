import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddonsComponent } from './product-addons.component';

describe('ProductAddonsComponent', () => {
  let component: ProductAddonsComponent;
  let fixture: ComponentFixture<ProductAddonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAddonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
