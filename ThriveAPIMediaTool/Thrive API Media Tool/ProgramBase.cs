using CommandLine;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Thrive_API_Media_Tool.DTOs.Responses;

namespace Thrive_API_Media_Tool
{
    internal class ProgramBase
    {
        private static AppSettings _appSettings;
        public static Options _options = new Options();

        /// <summary>
        /// Read the CLI args in and parse as Options object
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        internal static void ParseArguments(string[] args)
        {
            try
            {
                var result = Parser.Default.ParseArguments<Options>(args).MapResult((opts) => MapOptions(opts), //in case parser sucess
                             errs => HandleParseError(errs)); //in  case parser fail

                if (result != 1)
                {
                    throw new Exception("One or more Options failed to parse. Check log messages above for more info.");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw;
            }
        }

        private static int MapOptions(Options opts)
        {
            _options = opts;
            return 1;
        }

        private static int HandleParseError(IEnumerable<Error> errs)
        {
            var result = -2;
            Console.WriteLine("errors {0}", errs.Count());

            if (errs.Any(x => x is HelpRequestedError || x is VersionRequestedError))
            {
                result = -1;
            }

            Console.WriteLine("Exit code {0}", result);
            return result;
        }

        /// <summary>
        /// Reads all the configs from the appsettings.json file
        /// </summary>
        internal static void ReadAppSettings()
        {
            using StreamReader file = new StreamReader("appsettings.json");
            var fileAsString = file.ReadToEnd();

            _appSettings = JsonConvert.DeserializeObject<AppSettings>(fileAsString);
        }

        /// <summary>
        /// Retrieves a list of all the sermons in the Thrive Church Official API
        /// </summary>
        /// <returns></returns>
        internal static void GetAllSermons()
        {
            var url = $"{_appSettings.ThriveAPIUrl}api/sermons";
            HttpResponseMessage results = SendRequestAsync(url, HttpMethod.Get).Result;

            var responseString = results.Content.ReadAsStringAsync().Result;

            AllSermonsSummaryResponse allSermonsSummaryResponse = JsonConvert.DeserializeObject<AllSermonsSummaryResponse>(responseString);

            foreach (var sermonSeries in allSermonsSummaryResponse.Summaries)
            {
                Console.WriteLine($"\nID: {sermonSeries.Id}, Name: {sermonSeries.Title}");
            }

            return;
        }

        /// <summary>
        /// Send a request to the specified URL
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="authToken"></param>
        /// <param name="parameters"></param>
        /// <param name="skipEscape"></param>
        /// <returns></returns>
        public static Task<HttpResponseMessage> SendRequestAsync(string url, HttpMethod method, Dictionary<string, string> parameters = null)
        {
            if (parameters != null && parameters.Any())
            {
                foreach (var parameter in parameters)
                {
                    url += $"&{parameter.Key}={parameter.Key}";
                }
            }

            var escapedUrlString = url;

            var request = new HttpRequestMessage(method, escapedUrlString);
            request.Headers.Add("Accept", "application/json");
            request.Headers.Add("User-Agent", "HttpClient");

            HttpClient client = new HttpClient();

            return client.SendAsync(request);
        }
    }
}