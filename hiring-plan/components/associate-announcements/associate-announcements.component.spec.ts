import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateAnnouncementsComponent } from './associate-announcements.component';

describe('AssociateAnnouncementsComponent', () => {
  let component: AssociateAnnouncementsComponent;
  let fixture: ComponentFixture<AssociateAnnouncementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateAnnouncementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
