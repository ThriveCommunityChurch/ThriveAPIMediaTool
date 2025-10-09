import {} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// Mock environment
export const environment = {
  production: false,
  apiURL: 'http://localhost:8080'
};

// Common test modules
export const TestModules = [
  HttpClientTestingModule,
  RouterTestingModule,
  FormsModule,
  NgxSkeletonLoaderModule
];

// Mock SermonSeriesSummary
export const mockSermonSeriesSummary = {
  Id: '123',
  Title: 'Test Series',
  StartDate: '2023-01-01T00:00:00Z',
  LastUpdated: '2023-01-10T00:00:00Z',
  ArtUrl: 'http://example.com/image.jpg',
  EndDate: null,
  MessageCount: 5
};

// Mock SermonSeries
export const mockSermonSeries = {
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

// Mock SermonMessage
export const mockSermonMessage = {
  Id: '456',
  Title: 'Test Message',
  Speaker: 'Test Speaker',
  Date: '2023-01-05T00:00:00Z',
  AudioUrl: 'http://example.com/audio.mp3',
  AudioFileSize: 10000,
  AudioDuration: 1800,
  PassageRef: 'John 3:16',
  SeriesId: '123',
  LastInSeries: false,
  PlayCount: 0
};
