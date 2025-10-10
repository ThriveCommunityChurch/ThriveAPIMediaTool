export interface SermonSeriesUpdateRequest {
    Name: string;
    StartDate: string;
    EndDate: string;
    Slug: string;
    Thumbnail: string;
    ArtUrl: string;
    Summary: string | null;
}
