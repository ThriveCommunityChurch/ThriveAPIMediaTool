import { SermonMessage } from "./SermonMessage";

export interface SermonSeries {
	Id: string;
	Name: string;
    Year: string;
    StartDate: string | null;
    EndDate: string | null;
    Slug: string;
    Thumbnail: string;
    ArtUrl: string;
    Messages: SermonMessage[];
}