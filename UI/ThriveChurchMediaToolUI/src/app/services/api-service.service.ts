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

@Injectable()
export class ApiService {

  apiUrl: string = environment.apiURL;

  constructor(private http: HttpClient) {

  }

  getSummaries(): Observable<HttpResponse<SermonSummaryResponse>> {
    return this.http.get<SermonSummaryResponse>(
      this.apiUrl.concat("/api/sermons"),
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

}