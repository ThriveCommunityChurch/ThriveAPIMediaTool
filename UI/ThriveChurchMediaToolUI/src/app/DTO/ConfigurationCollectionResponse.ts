import { ConfigurationResponse } from './ConfigurationResponse';

/**
 * Configuration collection response model matching the API ConfigurationCollectionResponse
 */
export interface ConfigurationCollectionResponse {
  /**
   * A collection of configuration values
   */
  Configs: ConfigurationResponse[];
}

