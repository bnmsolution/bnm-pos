import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantGridComponent } from './variant-grid.component';

describe('VariantGridComponent', () => {
  let component: VariantGridComponent;
  let fixture: ComponentFixture<VariantGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
