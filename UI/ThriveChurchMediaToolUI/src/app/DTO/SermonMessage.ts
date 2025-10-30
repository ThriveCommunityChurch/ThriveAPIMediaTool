import { MessageTag } from './MessageTag';

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
}