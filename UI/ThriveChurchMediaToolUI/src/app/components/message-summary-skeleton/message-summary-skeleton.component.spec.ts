import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSummarySkeletonComponent } from './message-summary-skeleton.component';

describe('MessageSummarySkeletonComponent', () => {
  let component: MessageSummarySkeletonComponent;
  let fixture: ComponentFixture<MessageSummarySkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageSummarySkeletonComponent]
    });
    fixture = TestBed.createComponent(MessageSummarySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
