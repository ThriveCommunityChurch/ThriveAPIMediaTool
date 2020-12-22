using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Thrive_API_Media_Tool.DTOs.Responses
{
    public class SermonSeriesSummary
    {
        /// <summary>
        /// The Id of the object in mongo
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Title of the sermon series
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Start date of this sermon series, Primary sorting key DESC order
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Direct link for the series' graphic
        /// </summary>
        public string ArtUrl { get; set; }
    }
}