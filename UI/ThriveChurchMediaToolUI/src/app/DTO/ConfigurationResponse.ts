import { ConfigType } from './ConfigType';

/**
 * Configuration response model matching the API ConfigurationResponse
 */
export interface ConfigurationResponse {
  /**
   * The key for the setting. This is the piece that we look for
   */
  Key: string;

  /**
   * The value for this setting. This is the value that gets used
   */
  Value: string;

  /**
   * The type of configuration value
   * Can be either a ConfigType enum value or a string (API returns string)
   */
  Type: ConfigType | string;
}

