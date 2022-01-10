import { SermonMessage } from "./SermonMessage";

export interface SermonSeries {
	Id: string;
	Name: string;
    Year: string;
    StartDate: Date | null;
    EndDate: Date | null;
    Slug: string;
    Thumbnail: string;
    ArtUrl: string;
    Messages: SermonMessage[];
}