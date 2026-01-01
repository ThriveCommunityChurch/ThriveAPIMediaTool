import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UrlFormatter } from '../shared/UrlFormatter';

import { SermonSummaryResponse } from '../DTO/SermonSummaryResponse';
import { SermonStatsChartResponse } from '../DTO/SermonStatsChartResponse';
import { CreateSermonSeriesRequest } from '../DTO/CreateSermonSeriesRequest';
import { SermonSeries } from '../DTO/SermonSeries';
import { SermonSeriesUpdateRequest } from '../DTO/SermonSeriesUpdateRequest';
import { AddMessagesToSeriesRequest } from '../DTO/AddMessagesToSeriesRequest';
import { SermonStatsResponse } from '../DTO/SermonStatsResponse';
import { UpdateMessagesInSermonSeriesRequest } from '../DTO/UpdateMessagesInSermonSeriesRequest';
import { SermonMessage } from '../DTO/SermonMessage';
import { SearchRequest } from '../DTO/SearchRequest';
import { SearchResponse } from '../DTO/SearchResponse';
import { PodcastMessage } from '../DTO/PodcastMessage';
import { PodcastMessageRequest } from '../DTO/PodcastMessageRequest';
import { AllEventsResponse, CreateEventRequest, EventResponse, SystemResponse, UpdateEventRequest } from '../DTO/events';

@Injectable()
export class ApiService {

  apiUrl: string = environment.apiURL;

  constructor(private http: HttpClient) {

  }

  getSummaries(): Observable<HttpResponse<SermonSummaryResponse>> {
    return this.http.get<SermonSummaryResponse>(
      this.apiUrl.concat("/api/sermons?highResImg=true"),
      {
        observe: 'response'
      }
    )
  }

  createSeries(request: CreateSermonSeriesRequest): Observable<HttpResponse<SermonSeries>> {
    return this.http.post<SermonSeries>(
      this.apiUrl.concat("/api/sermons/series"),
      request,
      {
        observe: 'response'
      }
    )
  }

  getSeries(id: string): Observable<HttpResponse<SermonSeries>> {
    return this.http.get<SermonSeries>(
      this.apiUrl.concat(`/api/sermons/series/${id}`),
      {
        observe: 'response'
      }
    )
  }

  addMessageToSeries(seriesId: string, newMessage: AddMessagesToSeriesRequest): Observable<HttpResponse<SermonSeries>> {
    return this.http.post<SermonSeries>(
      this.apiUrl.concat(`/api/sermons/series/${seriesId}/message`),
      newMessage,
      {
        observe: 'response'
      }
    )
  }

  editSeries(seriesId: string, updateRequest: SermonSeriesUpdateRequest): Observable<HttpResponse<SermonSeries>> {
    return this.http.put<SermonSeries>(
      this.apiUrl.concat(`/api/sermons/series/${seriesId}`),
      updateRequest,
      {
        observe: 'response'
      }
    )
  }

  getStats(): Observable<HttpResponse<SermonStatsResponse>> {
    return this.http.get<SermonStatsResponse>(
      this.apiUrl.concat(`/api/sermons/stats`),
      {
        observe: 'response'
      }
    )
  }

  updateMessage(messageId: string, request: UpdateMessagesInSermonSeriesRequest): Observable<HttpResponse<SermonMessage>> {
    return this.http.put<SermonMessage>(
      this.apiUrl.concat(`/api/sermons/series/message/${messageId}`),
      request,
      {
        observe: 'response'
      }
    )
  }

  getStatsChart(startDate: string | null, endDate: string | null, reportType: string, displayType: string): Observable<HttpResponse<SermonStatsChartResponse>> {

    const queryParams = {
      startDate: startDate,
      endDate: endDate,
      chartType: reportType,
      displayType: displayType
    };

    const queryString = UrlFormatter.formatQueryParams(queryParams);

    return this.http.get<SermonStatsChartResponse>(
      this.apiUrl.concat(`/api/sermons/stats/chart${queryString}`),
      {
        observe: 'response'
      }
    )
  }

  uploadAudioFile(file: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
      this.apiUrl.concat("/api/sermons/audio/upload"),
      formData,
      {
        observe: 'response'
      }
    )
  }

  search(request: SearchRequest): Observable<HttpResponse<SearchResponse>> {
    return this.http.post<SearchResponse>(
      this.apiUrl.concat("/api/sermons/search"),
      request,
      {
        observe: 'response'
      }
    )
  }

  getSpeakers(): Observable<HttpResponse<string[]>> {
    return this.http.get<string[]>(
      this.apiUrl.concat("/api/sermons/speakers"),
      {
        observe: 'response'
      }
    )
  }

  exportSermonData(): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      this.apiUrl.concat("/api/sermons/export"),
      {},
      {
        observe: 'response'
      }
    )
  }

  importSermonData(data: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      this.apiUrl.concat("/api/sermons/import"),
      data,
      {
        observe: 'response'
      }
    )
  }

  rebuildRssFeed(): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      this.apiUrl.concat("/api/sermons/feed/rebuild"),
      {},
      {
        observe: 'response'
      }
    )
  }

  getRssFeedUrl(): string {
    return environment.rssFeedURL;
  }

  getPodcastMessages(): Observable<HttpResponse<PodcastMessage[]>> {
    return this.http.get<PodcastMessage[]>(
      this.apiUrl.concat("/api/sermons/feed/messages"),
      {
        observe: 'response'
      }
    )
  }

  updatePodcastMessage(messageId: string, request: PodcastMessageRequest): Observable<HttpResponse<PodcastMessage>> {
    return this.http.post<PodcastMessage>(
      this.apiUrl.concat(`/api/sermons/feed/message/${messageId}`),
      request,
      {
        observe: 'response'
      }
    )
  }

  // ============================================
  // Events API Methods
  // ============================================

  /**
   * Get all events with optional inactive filter
   */
  getAllEvents(includeInactive: boolean = false): Observable<HttpResponse<SystemResponse<AllEventsResponse>>> {
    return this.http.get<SystemResponse<AllEventsResponse>>(
      this.apiUrl.concat(`/api/events?includeInactive=${includeInactive}`),
      {
        observe: 'response'
      }
    )
  }

  /**
   * Get a single event by ID
   */
  getEventById(id: string): Observable<HttpResponse<SystemResponse<EventResponse>>> {
    return this.http.get<SystemResponse<EventResponse>>(
      this.apiUrl.concat(`/api/events/${id}`),
      {
        observe: 'response'
      }
    )
  }

  /**
   * Create a new event
   */
  createEvent(request: CreateEventRequest): Observable<HttpResponse<SystemResponse<EventResponse>>> {
    return this.http.post<SystemResponse<EventResponse>>(
      this.apiUrl.concat("/api/events"),
      request,
      {
        observe: 'response'
      }
    )
  }

  /**
   * Update an existing event
   */
  updateEvent(id: string, request: UpdateEventRequest): Observable<HttpResponse<SystemResponse<EventResponse>>> {
    return this.http.put<SystemResponse<EventResponse>>(
      this.apiUrl.concat(`/api/events/${id}`),
      request,
      {
        observe: 'response'
      }
    )
  }

  /**
   * Delete an event (soft delete by default, hard delete if specified)
   */
  deleteEvent(id: string, hardDelete: boolean = false): Observable<HttpResponse<SystemResponse<string>>> {
    return this.http.delete<SystemResponse<string>>(
      this.apiUrl.concat(`/api/events/${id}?hardDelete=${hardDelete}`),
      {
        observe: 'response'
      }
    )
  }

  /**
   * Deactivate (cancel) an event (soft delete)
   */
  deactivateEvent(id: string): Observable<HttpResponse<SystemResponse<EventResponse>>> {
    return this.http.put<SystemResponse<EventResponse>>(
      this.apiUrl.concat(`/api/events/${id}/deactivate`),
      {},
      {
        observe: 'response'
      }
    )
  }

}