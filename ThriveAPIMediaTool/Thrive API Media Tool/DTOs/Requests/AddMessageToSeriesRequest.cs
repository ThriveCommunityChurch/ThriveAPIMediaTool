using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Thrive_API_Media_Tool.DTOs
{
    public class AddMessageToSeriesRequest
    {
        /// <summary>
        /// A collection of messages that should be added to this Sermon Series
        /// </summary>
        public IEnumerable<SermonMessageRequest> MessagesToAdd { get; set; }
    }
}