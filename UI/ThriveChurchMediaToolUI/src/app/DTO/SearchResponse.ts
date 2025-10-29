import { SermonMessage } from './SermonMessage';

/**
 * Sermon series response from API search
 */
export interface SermonSeriesSearchResult {
  Id: string;
  Name: string;
  Year: string;
  StartDate: string;
  EndDate: string | null;
  Slug: string;
  Thumbnail: string;
  ArtUrl: string;
  LastUpdated: string;
  Messages: SermonMessage[];
  Tags: string[];
  Summary: string | null;
}

/**
 * Response object for tag-based search results
 */
export interface SearchResponse {
  /**
   * Collection of matching messages (populated when SearchTarget is Messages)
   */
  Messages: SermonMessage[];

  /**
   * Collection of matching series (populated when SearchTarget is Series)
   */
  Series: SermonSeriesSearchResult[];
}

