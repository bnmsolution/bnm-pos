import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantOptionsComponent } from './variant-options.component';

describe('VariantOptionsComponent', () => {
  let component: VariantOptionsComponent;
  let fixture: ComponentFixture<VariantOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
