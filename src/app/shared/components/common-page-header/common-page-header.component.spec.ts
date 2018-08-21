import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPageHeaderComponent } from './common-page-header.component';

describe('CommonPageHeaderComponent', () => {
  let component: CommonPageHeaderComponent;
  let fixture: ComponentFixture<CommonPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
