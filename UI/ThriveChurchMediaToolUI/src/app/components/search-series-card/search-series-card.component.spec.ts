import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSeriesCardComponent } from './search-series-card.component';

describe('SearchSeriesCardComponent', () => {
  let component: SearchSeriesCardComponent;
  let fixture: ComponentFixture<SearchSeriesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSeriesCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSeriesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

