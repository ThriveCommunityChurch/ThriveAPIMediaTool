export interface SermonMessageRequest {
    AudioUrl: string | null;
    AudioDuration: number | null;
    AudioFileSize: number | null;
    VideoUrl: string | null;
    PassageRef: string | null;
    Speaker: string;
    Title: string;
    Summary: string | null;
    Date: string;
    Tags: string[];  // API expects enum string names, not numeric values
    WaveformData: number[] | null;
    LastInSeries?: boolean;
}