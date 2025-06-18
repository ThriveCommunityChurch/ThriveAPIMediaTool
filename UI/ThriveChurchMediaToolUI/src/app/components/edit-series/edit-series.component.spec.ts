import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { EditSeriesComponent } from './edit-series.component';
import { ApiService } from 'src/app/services/api-service.service';
import { ToastService } from 'src/app/services/toast-service.service';

describe('EditSeriesComponent', () => {
  let component: EditSeriesComponent;
  let fixture: ComponentFixture<EditSeriesComponent>;
  let apiServiceMock: any;
  let toastServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  const seriesId = '123';

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getSeries', 'editSeries']);
    toastServiceMock = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Mock the API response
    const mockSeries = {
      Id: '123',
      Name: 'Test Series',
      Year: '2023',
      StartDate: '2023-01-01T00:00:00Z',
      EndDate: null,
      Slug: 'test-series',
      Thumbnail: 'http://example.com/thumbnail.jpg',
      ArtUrl: 'http://example.com/image.jpg',
      Messages: []
    };

    apiServiceMock.getSeries.and.returnValue(
      of(new HttpResponse<any>({
        body: mockSeries,
        status: 200
      }))
    );

    apiServiceMock.editSeries.and.returnValue(
      of(new HttpResponse<any>({
        body: mockSeries,
        status: 200
      }))
    );

    // Mock ActivatedRoute
    activatedRouteMock = {
      paramMap: of(convertToParamMap({ id: seriesId }))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [EditSeriesComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load series data on init', () => {
    expect(apiServiceMock.getSeries).toHaveBeenCalledWith(seriesId);
    expect(component.seriesId).toBe(seriesId);
  });

  it('should handle form submission', () => {
    // Set up form values
    component.seriesName = 'Updated Series';
    component.seriesThumbnailUrl = 'http://example.com/updated-thumbnail.jpg';
    component.seriesArtUrl = 'http://example.com/updated-image.jpg';
    component.seriesSlug = 'updated-series';
    component.startDate = '2023-01-01';
    component.endDate = '2023-01-31';

    // Submit form
    component.onSubmit();

    // Verify API call
    expect(apiServiceMock.editSeries).toHaveBeenCalled();
    const updateRequest = apiServiceMock.editSeries.calls.mostRecent().args[1];
    expect(updateRequest.Name).toBe('Updated Series');
    expect(updateRequest.Thumbnail).toBe('http://example.com/updated-thumbnail.jpg');
    expect(updateRequest.ArtUrl).toBe('http://example.com/updated-image.jpg');
    expect(updateRequest.Slug).toBe('updated-series');

    // Verify toast and navigation
    expect(toastServiceMock.showSuccess).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle API errors', () => {
    // Mock API error
    apiServiceMock.editSeries.and.returnValue(
      of(new HttpResponse<any>({
        body: { error: 'Something went wrong' },
        status: 400
      }))
    );

    // Submit form
    component.onSubmit();

    // Verify error handling
    expect(toastServiceMock.showError).toHaveBeenCalled();
  });

  it('should navigate to home on cancel', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
