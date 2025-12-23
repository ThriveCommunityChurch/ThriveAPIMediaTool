export interface PodcastMessageRequest {
  title: string;
  description: string;
  audioUrl: string;
  audioFileSize: number;
  audioDuration: number;
  pubDate: Date | string;
  speaker: string;
  createdAt: Date | string;
  podcastTitle: string;
  artworkUrl: string;
}

