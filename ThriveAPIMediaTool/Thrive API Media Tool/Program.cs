using System;

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
                return;
            }

            ReadAppSettings();

            Console.WriteLine("Setup stages completed.");

            if (!_options.IsNew)
            {
                GetAllSermons();
            }

            Console.WriteLine("Which series would you like to modify? Please enter ID.");

            var seriesId = Console.ReadLine();
            if (string.IsNullOrEmpty(seriesId))
            {
                Console.WriteLine("Unkown series ID. Please start again..");
                return;
            }

            // Update this series with the requested ID, we'll just need to ask for each property one at a time

        }
    }
}