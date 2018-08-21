import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailWithOptionsComponent } from './email-with-options.component';

describe('EmailWithOptionsComponent', () => {
  let component: EmailWithOptionsComponent;
  let fixture: ComponentFixture<EmailWithOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailWithOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailWithOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
