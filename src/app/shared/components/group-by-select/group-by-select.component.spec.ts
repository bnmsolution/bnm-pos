import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBySelectComponent } from './group-by-select.component';

describe('GroupBySelectComponent', () => {
  let component: GroupBySelectComponent;
  let fixture: ComponentFixture<GroupBySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBySelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
