﻿using CommandLine;

namespace Thrive_API_Media_Tool
{
    public class Options
    {
        [Option('n', "New", Required = false, HelpText = "Whether or not this is a new series.", Default = false)]
        public string IsNew { get; set; }

        [Option('s', "SeriesId", Required = false, HelpText = "The unique identifier of the series in which to add this media item to.", Default = null)]
        public string SeriesId { get; set; }

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
    }
}