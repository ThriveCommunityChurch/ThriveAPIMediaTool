/**
 * Configuration type enum matching the API ConfigType enum
 */
export enum ConfigType {
  Phone = 0,
  Email = 1,
  Link = 2,
  Misc = 3,
  Social = 4
}

/**
 * Helper function to get display name for ConfigType
 */
export function getConfigTypeDisplayName(type: ConfigType): string {
  switch (type) {
    case ConfigType.Phone:
      return 'Phone';
    case ConfigType.Email:
      return 'Email';
    case ConfigType.Link:
      return 'Link';
    case ConfigType.Misc:
      return 'Miscellaneous';
    case ConfigType.Social:
      return 'Social Media';
    default:
      return 'Unknown';
  }
}

/**
 * Helper function to get icon for ConfigType
 */
export function getConfigTypeIcon(type: ConfigType): string {
  switch (type) {
    case ConfigType.Phone:
      return 'fa-phone';
    case ConfigType.Email:
      return 'fa-envelope';
    case ConfigType.Link:
      return 'fa-link';
    case ConfigType.Misc:
      return 'fa-cog';
    case ConfigType.Social:
      return 'fa-share-alt';
    default:
      return 'fa-question';
  }
}

