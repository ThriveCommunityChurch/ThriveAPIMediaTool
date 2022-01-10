import { SermonMessageRequest } from "./SermonMessageRequest";

export interface CreateSermonSeriesRequest {
    Name: string;
    Year: string;
    StartDate: string;
    EndDate: string | null;
    Slug: string;
    Thumbnail: string;
    ArtUrl: string;
    Messages: SermonMessageRequest[];
}