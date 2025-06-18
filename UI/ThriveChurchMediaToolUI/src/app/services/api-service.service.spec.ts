import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';

import { ApiService } from './api-service.service';
import { environment } from 'src/environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiURL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get summaries', () => {
    const mockResponse = {
      Summaries: [{
        Id: '123',
        Title: 'Test Series',
        StartDate: '2023-01-01T00:00:00Z',
        LastUpdated: '2023-01-10T00:00:00Z',
        ArtUrl: 'http://example.com/image.jpg',
        EndDate: null,
        MessageCount: 5
      }]
    };

    service.getSummaries().subscribe(response => {
      expect(response.body).toBeTruthy();
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/sermons`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse, { status: 200, statusText: 'OK' });
  });

  it('should get series by id', () => {
    const seriesId = '123';
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

    service.getSeries(seriesId).subscribe(response => {
      expect(response.body).toBeTruthy();
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/sermons/series/${seriesId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSeries, { status: 200, statusText: 'OK' });
  });
});
