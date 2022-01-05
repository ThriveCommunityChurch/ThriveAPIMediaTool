import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SermonSummaryResponse } from '../DTO/SermonSummaryResponse';
import { Configurations } from '../shared/configurations';
import { CreateSermonSeriesRequest } from '../DTO/CreateSermonSeriesRequest';
import { SermonSeries } from '../DTO/SermonSeries';

@Injectable()
export class ApiService {

  apiUrl: string = '';
  headers = {
    
  }

  /**
   * @return the `"X-API-Key"` & `authorization` tokens needed for HTTP requests
   */
  private getHeaders(): HttpHeaders
  {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type':'application/json',
      'Accept':'application/json',
    })
  }

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

}