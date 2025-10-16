import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ViewSeriesComponent } from './view-series.component';
import { ApiService } from 'src/app/services/api-service.service';
import { SeriesDataService } from 'src/app/services/series-data-service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ViewSeriesComponent', () => {
  let component: ViewSeriesComponent;
  let fixture: ComponentFixture<ViewSeriesComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let seriesDataServiceMock: jasmine.SpyObj<SeriesDataService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  const seriesId = '123';

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getSeries']);
    seriesDataServiceMock = jasmine.createSpyObj('SeriesDataService', ['add']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Mock ActivatedRoute
    activatedRouteMock = {
      paramMap: of(convertToParamMap({ id: seriesId }))
    };

    await TestBed.configureTestingModule({
    declarations: [ViewSeriesComponent],
    imports: [],
    providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: SeriesDataService, useValue: seriesDataServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
