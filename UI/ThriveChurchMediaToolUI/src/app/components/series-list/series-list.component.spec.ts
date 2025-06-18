import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { SeriesListComponent } from './series-list.component';
import { ApiService } from 'src/app/services/api-service.service';
import { SeriesItemComponent } from '../series-item/series-item.component';
import { SeriesItemSkeletonComponent } from '../series-item-skeleton/series-item-skeleton.component';
import { mockSermonSeriesSummary, TestModules } from 'src/test-helpers/test-environment';
import { SermonSummaryResponse } from 'src/app/DTO/SermonSummaryResponse';

describe('SeriesListComponent', () => {
  let component: SeriesListComponent;
  let fixture: ComponentFixture<SeriesListComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockSummaryResponse: SermonSummaryResponse = {
    Summaries: [mockSermonSeriesSummary]
  };

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getSummaries']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Mock the API response
    apiServiceMock.getSummaries.and.returnValue(
      of(new HttpResponse<SermonSummaryResponse>({
        body: mockSummaryResponse,
        status: 200
      }))
    );

    await TestBed.configureTestingModule({
      imports: TestModules,
      declarations: [
        SeriesListComponent,
        SeriesItemComponent,
        SeriesItemSkeletonComponent
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSummaries on init', () => {
    expect(apiServiceMock.getSummaries).toHaveBeenCalled();
  });

  it('should populate summaries array with API response data', () => {
    expect(component.summaries.length).toBe(1);
    expect(component.summaries[0]).toEqual(mockSermonSeriesSummary);
  });

  it('should set isContentLoaded to true after loading data', () => {
    expect(component.isContentLoaded).toBe(true);
  });

  it('should handle empty response correctly', () => {
    // Reset component
    component.summaries = [];
    component.isContentLoaded = false;

    // Mock empty response
    apiServiceMock.getSummaries.and.returnValue(
      of(new HttpResponse<SermonSummaryResponse>({
        body: { Summaries: [] },
        status: 200
      }))
    );

    // Re-initialize
    component.ngOnInit();

    expect(component.summaries.length).toBe(0);
    expect(component.isContentLoaded).toBe(true);
  });
});
