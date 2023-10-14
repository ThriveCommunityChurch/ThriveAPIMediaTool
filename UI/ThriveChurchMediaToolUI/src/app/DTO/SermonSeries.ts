import { SermonMessage } from "./SermonMessage";

export interface SermonSeries {
	Id: string;
	Name: string;
    Year: string;
    StartDate: string | undefined | null;
    EndDate: string | undefined | null;
    Slug: string;
    Thumbnail: string;
    ArtUrl: string | undefined;
    Messages: SermonMessage[];
}