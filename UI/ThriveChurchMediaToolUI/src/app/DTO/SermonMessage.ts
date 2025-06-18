export interface SermonMessage {
	AudioUrl: string | null;
    AudioDuration: number | null;
    AudioFileSize: number | null;
    VideoUrl: string | null;
    PassageRef: string | null;
    Speaker: string;
    Title: string;
    Date: Date | null;
	MessageId: string;
	PlayCount: number;
}