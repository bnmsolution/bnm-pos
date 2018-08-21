import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSearchComponent } from './register-search.component';

describe('SearchComponent', () => {
  let component: RegisterSearchComponent;
  let fixture: ComponentFixture<RegisterSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
