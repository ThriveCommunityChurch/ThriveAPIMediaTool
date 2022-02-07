import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SermonSummaryResponse } from '../DTO/SermonSummaryResponse';

import { CreateSermonSeriesRequest } from '../DTO/CreateSermonSeriesRequest';
import { SermonSeries } from '../DTO/SermonSeries';
import { AddMessagesToSeriesRequest } from '../DTO/AddMessagesToSeriesRequest';
import { environment } from 'src/environments/environment';
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

  editSeries(seriesId: string, newMessage: SermonSeries): Observable<HttpResponse<SermonSeries>> {
    return this.http.put<SermonSeries>(
      this.apiUrl.concat(`/api/sermons/series/${seriesId}`),
      newMessage,
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

}