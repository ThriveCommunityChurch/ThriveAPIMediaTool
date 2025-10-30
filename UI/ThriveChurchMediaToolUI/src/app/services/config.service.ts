import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ConfigurationCollectionResponse } from '../DTO/ConfigurationCollectionResponse';
import { SetConfigRequest } from '../DTO/SetConfigRequest';

/**
 * Service for managing configuration settings via the API
 */
@Injectable()
export class ConfigService {

  apiUrl: string = environment.apiURL;

  constructor(private http: HttpClient) { }

  /**
   * Get all configuration settings
   * Requires authentication
   */
  getAllConfigs(): Observable<HttpResponse<ConfigurationCollectionResponse>> {
    return this.http.get<ConfigurationCollectionResponse>(
      this.apiUrl.concat("/api/config/all"),
      {
        observe: 'response'
      }
    );
  }

  /**
   * Set configuration values
   * Requires authentication
   * @param request SetConfigRequest containing configurations to update
   */
  setConfigValues(request: SetConfigRequest): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      this.apiUrl.concat("/api/config/values"),
      request,
      {
        observe: 'response'
      }
    );
  }

  /**
   * Delete a configuration setting by key
   * Requires authentication
   * @param key The configuration key to delete
   */
  deleteConfig(key: string): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      this.apiUrl.concat(`/api/config?setting=${encodeURIComponent(key)}`),
      {
        observe: 'response'
      }
    );
  }
}

