import { LongestSermonSeriesSummary } from "./LongestSermonSeriesSummary";
import { SermonMessageSummary } from "./SermonMessageSummary";
import { SpeakerStats } from "./SpeakerStats";

export interface SermonStatsResponse {
	TotalSeriesNum: number;
	TotalMessageNum: number;
	AvgMessagesPerSeries: number;
	TotalAudioLength: number;
	AvgAudioLength: number;
	TotalFileSize: number;
	AvgFileSize: number;
	SpeakerStats: SpeakerStats[];
	LongestMessage: SermonMessageSummary | null;
	LongestSeries: LongestSermonSeriesSummary | null;
}