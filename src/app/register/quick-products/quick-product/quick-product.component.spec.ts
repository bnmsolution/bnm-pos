/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuickProductComponent } from './quick-product.component';

describe('QuickProductComponent', () => {
  let component: QuickProductComponent;
  let fixture: ComponentFixture<QuickProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
