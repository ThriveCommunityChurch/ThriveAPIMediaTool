/**
 * Response containing transcript data for a sermon message
 */
export interface TranscriptResponse {
  /**
   * The unique identifier of the message this transcript belongs to
   */
  MessageId: string;

  /**
   * The title of the sermon message
   */
  Title: string;

  /**
   * The speaker who delivered this message
   */
  Speaker: string;

  /**
   * The full transcript text
   */
  FullText: string;

  /**
   * The total word count of the transcript
   */
  WordCount: number;

  /**
   * AI-generated sermon notes (optional - may not be present for older transcripts)
   */
  Notes?: SermonNotesResponse;

  /**
   * AI-generated study guide (optional - may not be present for older transcripts)
   */
  StudyGuide?: StudyGuideResponse;
}

/**
 * AI-generated sermon notes
 */
export interface SermonNotesResponse {
  Title: string;
  Speaker: string;
  Date: string;
  MainScripture: string;
  Summary: string;
  KeyPoints: KeyPointResponse[];
  Quotes: QuoteResponse[];
  ApplicationPoints: string[];
  GeneratedAt: string;
  ModelUsed: string;
  WordCount: number;
}

/**
 * A key point from the sermon
 */
export interface KeyPointResponse {
  Point: string;
  Scripture?: string;
  Detail?: string;
  TheologicalContext?: string;
  DirectlyQuoted?: boolean;
}

/**
 * A notable quote from the sermon
 */
export interface QuoteResponse {
  Text: string;
  Context?: string;
}

/**
 * AI-generated study guide for small groups
 */
export interface StudyGuideResponse {
  Title: string;
  Speaker: string;
  Date: string;
  MainScripture: string;
  Summary: string;
  KeyPoints: KeyPointResponse[];
  ScriptureReferences: ScriptureReferenceResponse[];
  DiscussionQuestions: DiscussionQuestionsResponse;
  Illustrations: IllustrationResponse[];
  PrayerPrompts: string[];
  TakeHomeChallenges: string[];
  AdditionalStudy: AdditionalStudyResponse[];
  EstimatedStudyTime: string;
  GeneratedAt: string;
  ModelUsed: string;
  Confidence: ConfidenceResponse;
}

/**
 * Scripture reference with context
 */
export interface ScriptureReferenceResponse {
  Reference: string;
  Context: string;
  DirectlyQuoted: boolean;
}

/**
 * Categorized discussion questions
 */
export interface DiscussionQuestionsResponse {
  Icebreaker: string[];
  Reflection: string[];
  Application: string[];
  ForLeaders?: string[];
}

/**
 * Illustration or story from the sermon
 */
export interface IllustrationResponse {
  Summary: string;
  Point: string;
}

/**
 * Additional study topics
 */
export interface AdditionalStudyResponse {
  Topic: string;
  Scriptures: string[];
  Note: string;
}

/**
 * Confidence indicators for study guide accuracy
 */
export interface ConfidenceResponse {
  ScriptureAccuracy: string;
  ContentCoverage: string;
}
