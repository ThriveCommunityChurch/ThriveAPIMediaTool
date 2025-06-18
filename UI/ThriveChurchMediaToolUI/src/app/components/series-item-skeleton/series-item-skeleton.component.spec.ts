import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesItemSkeletonComponent } from './series-item-skeleton.component';

describe('SeriesItemSkeletonComponent', () => {
  let component: SeriesItemSkeletonComponent;
  let fixture: ComponentFixture<SeriesItemSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesItemSkeletonComponent]
    });
    fixture = TestBed.createComponent(SeriesItemSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
