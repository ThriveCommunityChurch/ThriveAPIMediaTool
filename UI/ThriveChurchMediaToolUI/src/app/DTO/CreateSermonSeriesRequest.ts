import { SermonMessageRequest } from "./SermonMessageRequest";

export interface CreateSermonSeriesRequest {
    Name: string;
    Year: string;
    StartDate: Date | null;
    EndDate: Date | null;
    Slug: string;
    Thumbnail: string;
    ArtUrl: string;
    Messages: SermonMessageRequest[];
}