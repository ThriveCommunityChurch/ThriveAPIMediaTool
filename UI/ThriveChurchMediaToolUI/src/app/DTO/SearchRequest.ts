import { MessageTag } from './MessageTag';
import { SearchTarget } from './SearchTarget';
import { SortDirection } from './SortDirection';

/**
 * Request object for searching messages or series by tags
 */
export interface SearchRequest {
  /**
   * Specifies the type of search to perform
   */
  SearchTarget: SearchTarget;

  /**
   * Collection of tags to filter by (required when SearchTarget is Messages or Series)
   */
  Tags: MessageTag[];

  /**
   * Search value (used for speaker name when SearchTarget is Speaker)
   * In the future, will be used for title/name filtering with Messages/Series
   */
  SearchValue?: string;

  /**
   * Sort direction for results (by date)
   */
  SortDirection: SortDirection;
}

