using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Thrive_API_Media_Tool.DTOs
{
    public class SermonMessageRequest
    {
        /// <summary>
        /// The audio URL for the new message
        /// </summary>
        public string AudioUrl { get; set; }

        /// <summary>
        /// The duration of the audio file in seconds
        /// </summary>
        public double? AudioDuration { get; set; }

        /// <summary>
        /// The file size of the message audio in MB
        /// </summary>
        public double? AudioFileSize { get; set; }

        /// <summary>
        /// The URL of the video file for this message
        /// </summary>
        public string VideoUrl { get; set; }

        /// <summary>
        /// The main passage reference for this message
        /// </summary>
        public string PassageRef { get; set; }

        /// <summary>
        /// The speaker of the sermon message
        /// </summary>
        public string Speaker { get; set; }

        /// <summary>
        /// The title of this sermon message
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// The date of this sermon message
        /// </summary>
        public DateTime Date { get; set; }
    }
}