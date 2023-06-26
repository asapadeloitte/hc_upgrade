import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTemporaryPromotionLogComponent } from './detail-temporary-promotion-log.component';

describe('DetailTemporaryPromotionLogComponent', () => {
  let component: DetailTemporaryPromotionLogComponent;
  let fixture: ComponentFixture<DetailTemporaryPromotionLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTemporaryPromotionLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTemporaryPromotionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
