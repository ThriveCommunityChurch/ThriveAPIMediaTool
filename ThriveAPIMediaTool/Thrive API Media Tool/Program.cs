using NAudio.Wave;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using Thrive_API_Media_Tool.DTOs;

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

            // Validations
            if (!string.IsNullOrEmpty(_options.VideoUrl) && !ValidURL(_options.VideoUrl))
            {
                throw new ArgumentException($"Argument {nameof(Options.VideoUrl)} is not a properly formatted URL.");
            }
            
            if (!string.IsNullOrEmpty(_options.AudioUrl) && !ValidURL(_options.AudioUrl))
            {
                throw new ArgumentException($"Argument {nameof(Options.AudioUrl)} is not a properly formatted URL.");
            }

            ReadAppSettings();

            // testing access to the file path
            if (!string.IsNullOrEmpty(_options.AudioFilePath))
            {
                if (!string.IsNullOrEmpty(_options.AudioFileSize) || !string.IsNullOrEmpty(_options.AudioDuration))
                {
                    throw new ArgumentException("Argument AudioFilePath (z) cannot be used in conjunction with AudioFileSize (f) or AudioDuration (u).");
                }

                try
                {
                    string path = _options.AudioFilePath;

                    FileStream fileStream = File.OpenRead(path);
                    AudioFileSize = (fileStream.Length / Math.Pow(1024.0, 2.0));

                    // We need to get the duration of the reader in seconds
                    Mp3FileReader reader = new Mp3FileReader(path);
                    AudioDuration = reader.TotalTime.TotalSeconds;
                }
                catch
                {
                    throw;
                }
            }

            Console.WriteLine("Setup stages completed.\n\n");

            string seriesId = _options.SeriesId;
            bool isNew = false;
            bool isSingleSeries = false;

            bool newIsValid = bool.TryParse(_options.IsNew, out bool isNewSeries);
            if (newIsValid)
            {
                isNew = isNewSeries;
            } 
            
            bool validSingle = bool.TryParse(_options.SingleMessageSeries, out bool singleMessageSeries);
            if (validSingle)
            {
                isSingleSeries = singleMessageSeries;
            }

            #region Add new

            if (isNew)
            {
                if (!string.IsNullOrEmpty(seriesId))
                {
                    throw new ArgumentException($"Argument {nameof(Options.SeriesId)} cannot be used when creating a new sermon series.");
                }

                // validations
                if (string.IsNullOrEmpty(_options.ImageURL))
                {
                    throw new ArgumentNullException($"Argument {nameof(Options.ImageURL)} is required when creating a new sermon series.");
                }

                if (string.IsNullOrEmpty(_options.ThumbnailURL))
                {
                    throw new ArgumentNullException($"Argument {nameof(Options.ThumbnailURL)} is required when creating a new sermon series.");
                }

                if (!ValidURL(_options.ImageURL))
                {
                    throw new ArgumentException($"Argument {nameof(Options.ImageURL)} is not a properly formatted URL.");
                }
                
                if (!ValidURL(_options.ThumbnailURL))
                {
                    throw new ArgumentException($"Argument {nameof(Options.ThumbnailURL)} is not a properly formatted URL.");
                }

                CreateSermonSeriesRequest createRequest = GenerateCreateRequest(isSingleSeries);
                if (createRequest == null)
                {
                    Console.WriteLine("No series create object to send. One or more arguments might be invalid.");
                    return;
                }

                if (DebugMode)
                {
                    Console.ForegroundColor = ConsoleColor.Blue;

                    Console.WriteLine($"Requests will be sent to {APIUrl}", Console.ForegroundColor);

                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine($"Here is your request: \n{JsonConvert.SerializeObject(createRequest, Formatting.Indented)}");
                    Console.WriteLine("\n\nDebug mode is enabled, stopping execution.");
                    return;
                }

                HttpResponseMessage createResponse = CreateSeries(createRequest).Result;

                if (createResponse.StatusCode == HttpStatusCode.OK)
                {
                    Console.WriteLine("Successfully completed operations. You can now close this window.");
                    Console.ReadLine();
                }
                else
                {
                    Console.WriteLine($"Error sending request: Code - {createResponse.StatusCode}, ReasonPhrase - {createResponse.ReasonPhrase}");
                    Console.ReadLine();
                }

                return;
            } 
            
            #endregion

            #region Update

            if (!isNew)
            {
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
                AddMessageToSeriesRequest updateRequest = GenerateSeriesUpdateRequest();
                if (updateRequest == null)
                {
                    Console.WriteLine("No series update object to send. One or more arguments might be invalid.");
                    return;
                }

                if (DebugMode)
                {
                    Console.ForegroundColor = ConsoleColor.Blue;

                    Console.WriteLine($"Requests will be sent to {APIUrl}", Console.ForegroundColor);

                    Console.ForegroundColor = ConsoleColor.White;

                    Console.WriteLine($"Here is your request: \n{JsonConvert.SerializeObject(updateRequest, Formatting.Indented)}");
                    Console.WriteLine("\n\nDebug mode is enabled, stopping execution.");
                    return;
                }

                HttpResponseMessage updateResponse = UpdateSeries(updateRequest, seriesId).Result;

                // TODO: allow users to specify that this was the last sermon in a series.
                // Which needs to make another request with this series ID to update it as completed

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
            }

            #endregion
        }
    }
}