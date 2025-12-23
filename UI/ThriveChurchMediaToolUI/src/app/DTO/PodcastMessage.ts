export interface PodcastMessage {
  _id: string;
  messageId: string;
  title: string;
  description: string;
  audioUrl: string;
  audioFileSize: number;
  audioDuration: number;
  pubDate: Date | string;
  speaker: string;
  guid: string;
  createdAt: Date | string;
  podcastTitle: string;
  artworkUrl: string;
}

