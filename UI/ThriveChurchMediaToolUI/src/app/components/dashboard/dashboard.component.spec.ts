import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { SeriesListComponent } from '../series-list/series-list.component';
import { environment } from 'src/environments/environment';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [
        DashboardComponent,
        SeriesListComponent
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements like app-series-list
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set production flag based on environment', () => {
    expect(component.production).toBe(environment.production);
  });

  it('should set copyright text with current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.copyrightText).toContain(currentYear.toString());
    expect(component.copyrightText).toContain('Thrive Community Church');
  });
});
