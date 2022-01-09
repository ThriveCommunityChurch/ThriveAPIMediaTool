export interface SermonMessageRequest {
    AudioUrl: string | null;
    AudioDuration: number | null;
    AudioFileSize: number | null;
    VideoUrl: string | null;
    PassageRef: string | null;
    Speaker: string;
    Title: string;
    Date: string;
    MessageId: string | null;
}