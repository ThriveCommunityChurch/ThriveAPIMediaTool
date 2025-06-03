import { TestBed } from '@angular/core/testing';
import { SeriesDataService } from './series-data-service';

describe('SeriesDataService', () => {
  let service: SeriesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeriesDataService]
    });
    service = TestBed.inject(SeriesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty array', (done) => {
    service.seriesSummary$.subscribe(summaries => {
      expect(summaries).toEqual([]);
      done();
    });
  });

  it('should add a series summary to the observable', (done) => {
    const testSummary = {
      Id: '123',
      Title: 'Test Series',
      StartDate: '2023-01-01T00:00:00Z',
      LastUpdated: '2023-01-10T00:00:00Z',
      ArtUrl: 'http://example.com/image.jpg',
      EndDate: null,
      MessageCount: 5
    };

    service.add(testSummary);

    service.seriesSummary$.subscribe(summaries => {
      expect(summaries.length).toBe(1);
      done();
    });
  });

  it('should remove a series summary from the observable', (done) => {
    const testSummary = {
      Id: '123',
      Title: 'Test Series',
      StartDate: '2023-01-01T00:00:00Z',
      LastUpdated: '2023-01-10T00:00:00Z',
      ArtUrl: 'http://example.com/image.jpg',
      EndDate: null,
      MessageCount: 5
    };

    // First add a summary
    service.add(testSummary);

    // Then remove it
    service.remove(testSummary);

    service.seriesSummary$.subscribe(summaries => {
      expect(summaries.length).toBe(0);
      done();
    });
  });
});
