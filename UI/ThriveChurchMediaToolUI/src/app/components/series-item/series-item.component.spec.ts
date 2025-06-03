import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';

import { SeriesItemComponent } from './series-item.component';
import { SeriesDataService } from 'src/app/services/series-data-service';

describe('SeriesItemComponent', () => {
  let component: SeriesItemComponent;
  let fixture: ComponentFixture<SeriesItemComponent>;
  let seriesDataServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    seriesDataServiceMock = jasmine.createSpyObj('SeriesDataService', ['add']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SeriesItemComponent],
      providers: [
        { provide: SeriesDataService, useValue: seriesDataServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesItemComponent);
    component = fixture.componentInstance;
    component.summary = {
      Id: '123',
      Title: 'Test Series',
      StartDate: '2023-01-01T00:00:00Z',
      LastUpdated: '2023-01-10T00:00:00Z',
      ArtUrl: 'http://example.com/image.jpg',
      EndDate: null,
      MessageCount: 5
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call seriesDataService.add when setSeriesDataForNavigation is called', () => {
    component.setSeriesDataForNavigation();
    expect(seriesDataServiceMock.add).toHaveBeenCalled();
  });
});
