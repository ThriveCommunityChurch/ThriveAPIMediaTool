/**
 * Specifies the target entity type for searches
 */
export enum SearchTarget {
  /**
   * Search for individual sermon messages by tags
   */
  Messages = 0,

  /**
   * Search for sermon series by tags
   */
  Series = 1,

  /**
   * Search for messages by speaker name
   */
  Speaker = 2
}

/**
 * Convert SearchTarget enum value to its string name for API serialization
 */
export function getSearchTargetName(target: SearchTarget): string {
  return SearchTarget[target];
}

