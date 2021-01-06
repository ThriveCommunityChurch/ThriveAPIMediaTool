using CommandLine;

namespace Thrive_API_Media_Tool
{
    public class Options
    {
        [Option('n', "New", Required = false, HelpText = "Whether or not this is a new series. Cannot be used in conjunction with SeriesId (s).", Default = "false")]
        public string IsNew { get; set; }

        [Option('s', "SeriesId", Required = false, HelpText = "The unique identifier of the series in which to add this media item to.")]
        public string SeriesId { get; set; }
        
        [Option('m', "SeriesName", Required = false, HelpText = "The name of the new series. Only used when creating a new series.")]
        public string SeriesName { get; set; }
        
        [Option('e', "SingleMessageSeries", Required = false, HelpText = "Whether or not this new message is a single message series. Only used when creating a new series.", Default = "false")]
        public string SingleMessageSeries { get; set; }

        [Option('a', "AudioUrl", Required = false, HelpText = "The audio URL for the new message.")]
        public string AudioUrl { get; set; }
        
        [Option('u', "AudioDuration", Required = false, HelpText = "The duration of the audio file in seconds.")]
        public string AudioDuration { get; set; }
        
        [Option('f', "AudioFileSize", Required = false, HelpText = "The file size of the message audio in MB.")]
        public string AudioFileSize { get; set; }
        
        [Option('v', "VideoUrl", Required = false, HelpText = "The URL of the video file for this message.")]
        public string VideoUrl { get; set; }
        
        [Option('p', "PassageRef", Required = false, HelpText = "The main passage reference for this message.")]
        public string PassageRef { get; set; }
        
        [Option('k', "Speaker", Required = true, HelpText = "The speaker of the sermon message.")]
        public string Speaker { get; set; }
        
        [Option('t', "Title", Required = true, HelpText = "The title of this sermon message.")]
        public string Title { get; set; }
        
        [Option('d', "Date", Required = true, HelpText = "The date of this sermon message.")]
        public string Date { get; set; } 
        
        [Option('h', "AudioFilePath", Required = false, HelpText = "The path to the audio file. Should be .mp3 file type. Cannot be used in conjunction with AudioFileSize (f) or AudioDuration (u).")]
        public string AudioFilePath { get; set; }
        
        [Option('i', "ImageURL", Required = false, HelpText = "The URL for the main sermon series image. Required when creating a new series. Must be in valid URL syntax.")]
        public string ImageURL { get; set; } 
        
        [Option('l', "ThumbnailURL", Required = false, HelpText = "The URL for the compressed sermon series image. Required when creating a new series. Must be in valid URL syntax.")]
        public string ThumbnailURL { get; set; }

        [Option('g', "Debug", Required = false, HelpText = "Whether or not to run this tool in debug mode. Update & create operations will NOT complete if this setting is set. Default is false.", Default = "false")]
        public string Debug { get; set; }

    }
}