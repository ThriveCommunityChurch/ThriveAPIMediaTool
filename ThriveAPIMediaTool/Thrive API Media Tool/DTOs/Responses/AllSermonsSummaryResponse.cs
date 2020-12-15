using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Thrive_API_Media_Tool.DTOs.Responses
{
    public class AllSermonsSummaryResponse
    {
        /// <summary>
        /// Collection of Sermon Series summaries
        /// </summary>
        public IEnumerable<SermonSeriesSummary> Summaries { get; set; }
    }
}