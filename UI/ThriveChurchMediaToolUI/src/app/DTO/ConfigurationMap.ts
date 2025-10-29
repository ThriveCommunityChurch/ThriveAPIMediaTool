import { ConfigType } from './ConfigType';

/**
 * Configuration map model matching the API ConfigurationMap
 */
export interface ConfigurationMap {
  /**
   * The configuration key
   */
  Key: string;

  /**
   * The type of configuration value
   */
  Type: ConfigType;

  /**
   * The configuration value
   */
  Value: string;
}

