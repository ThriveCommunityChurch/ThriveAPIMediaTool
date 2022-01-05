import { SermonMessageRequest } from "./SermonMessageRequest";

export interface CreateSermonSeriesRequest {
    Name: string;
    Year: string;
    StartDate: string;
    EndDate: string;
    Slug: string;
    Thumbnail: string;
    ArtUrl: string;
    Messages: SermonMessageRequest[];
}