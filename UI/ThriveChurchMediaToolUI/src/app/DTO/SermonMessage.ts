import { MessageTag } from './MessageTag';

/**
 * Available transcript-related features for a sermon message.
 * Use these to determine which API endpoints can be called for additional content.
 */
export type TranscriptFeature = 'Transcript' | 'Notes' | 'StudyGuide';

export interface SermonMessage {
	AudioUrl: string | null;
    AudioDuration: number | null;
    AudioFileSize: number | null;
    VideoUrl: string | null;
    PassageRef: string | null;
    Speaker: string;
    Title: string;
    Summary: string | null;
    Date: Date | null;
	MessageId: string;
	PlayCount: number;
	Tags: string[];  // API returns enum string names, not numeric values
	WaveformData: number[] | null;
	PodcastImageUrl: string | null;
	PodcastTitle: string | null;
	/**
	 * List of transcript features available for this message.
	 * Use to determine which API endpoints to call:
	 * - 'Transcript': GET /api/sermons/series/message/{id}/transcript
	 * - 'Notes': GET /api/sermons/series/message/{id}/notes
	 * - 'StudyGuide': GET /api/sermons/series/message/{id}/study-guide
	 */
	AvailableTranscriptFeatures: TranscriptFeature[] | null;
}