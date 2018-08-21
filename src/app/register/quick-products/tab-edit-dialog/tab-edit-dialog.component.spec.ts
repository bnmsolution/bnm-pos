import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabEditDialogComponent } from './tab-edit-dialog.component';

describe('TabEditDialogComponent', () => {
  let component: TabEditDialogComponent;
  let fixture: ComponentFixture<TabEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
