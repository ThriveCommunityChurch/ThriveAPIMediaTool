import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SermonSummaryResponse } from '../DTO/SermonSummaryResponse';
import { Configurations } from '../shared/configurations';
import { CreateSermonSeriesRequest } from '../DTO/CreateSermonSeriesRequest';
import { SermonSeries } from '../DTO/SermonSeries';
import { AddMessagesToSeriesRequest } from '../DTO/AddMessagesToSeriesRequest';

@Injectable()
export class ApiService {

  apiUrl: string = '';

  constructor(private http: HttpClient, configs: Configurations) { 

    this.apiUrl = configs.ApiURL;
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

}