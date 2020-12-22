using System;
using System.Net;

namespace Thrive_API_Media_Tool
{
    class Program: ProgramBase
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Beginning setup...");

            if (args != null && args.Length > 0)
            {
                Console.WriteLine("Reading CLI args...");

                ParseArguments(args);

                if (string.IsNullOrEmpty(_options.Date))
                {
                    throw new ArgumentException($"Required argument: {nameof(Options.Date)}");
                }

                if (string.IsNullOrEmpty(_options.Title))
                {
                    throw new ArgumentException($"Required argument: {nameof(Options.Title)}");
                }

                if (string.IsNullOrEmpty(_options.Speaker))
                {
                    throw new ArgumentException($"Required argument: {nameof(Options.Speaker)}");
                }
            }
            else
            {
                throw new ArgumentException($"Required arguments: "
                    + $"[{nameof(Options.Date)}, {nameof(Options.Title)}, " 
                    + $"{nameof(Options.Speaker)}]");
            }

            ReadAppSettings();

            Console.WriteLine("Setup stages completed.\n\n");

            string seriesId = _options.SeriesId;
            bool isNew = false;

            bool validBool = bool.TryParse(_options.IsNew, out bool isNewSeries);
            if (validBool)
            {
                isNew = isNewSeries;
            }

            if (isNew)
            {
                // not yet supported
                throw new NotImplementedException();

                #region Add new

                //var updateRequest = GenerateCreateRequest();
                //if (updateRequest == null)
                //{
                //    Console.WriteLine("No series create object to send. One or more arguments might be invalid.");
                //    return;
                //}

                #endregion
            }

            #region Update

            if (string.IsNullOrEmpty(_options.SeriesId))
            {
                GetAllSermons();

                Console.WriteLine("Which series would you like to modify? Please enter the ID.");

                seriesId = Console.ReadLine();
                if (string.IsNullOrEmpty(seriesId))
                {
                    Console.WriteLine("Unkown series ID. Please start again..");
                    return;
                }
            }

            // Update this series with the requested ID, we'll just need to ask for each property one at a time
            var updateRequest = GenerateRequestForSeriesWithID(seriesId);
            if (updateRequest == null)
            {
                Console.WriteLine("No series update object to send. One or more arguments might be invalid.");
                return;
            }

            var updateResponse = UpdateSeries(updateRequest, seriesId).Result;

            if (updateResponse.StatusCode == HttpStatusCode.OK)
            {
                Console.WriteLine("Successfully completed operations. You can now close this window.");
                Console.ReadLine();
            }
            else
            {
                Console.WriteLine($"Error sending request: Code - {updateResponse.StatusCode}, ReasonPhrase - {updateResponse.ReasonPhrase}");
                Console.ReadLine();
            }

            return;

            #endregion
        }
    }
}