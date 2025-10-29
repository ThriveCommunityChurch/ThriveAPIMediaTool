/**
 * Specifies the sort direction for query results
 */
export enum SortDirection {
  /**
   * Sort in ascending order (oldest to newest for dates)
   */
  Ascending = 0,

  /**
   * Sort in descending order (newest to oldest for dates)
   */
  Descending = 1
}

/**
 * Convert SortDirection enum value to its string name for API serialization
 */
export function getSortDirectionName(direction: SortDirection): string {
  return SortDirection[direction];
}

