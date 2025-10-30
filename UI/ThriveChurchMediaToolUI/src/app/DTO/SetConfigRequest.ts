import { ConfigurationMap } from './ConfigurationMap';

/**
 * Set configuration request model matching the API SetConfigRequest
 */
export interface SetConfigRequest {
  /**
   * A collection of configurations to set
   */
  Configurations: ConfigurationMap[];
}

