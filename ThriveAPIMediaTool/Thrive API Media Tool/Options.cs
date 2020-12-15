using CommandLine;

namespace Thrive_API_Media_Tool
{
    public class Options
    {
        [Option('n', "New", Required = true, HelpText = "Whether or not this is a new series.")]
        public bool IsNew { get; set; }

        [Option('s', "SeriesId", Required = true, HelpText = "The unique identifier of the series in which to add this media item to.")]
        public string SeriesId { get; set; }
    }
}