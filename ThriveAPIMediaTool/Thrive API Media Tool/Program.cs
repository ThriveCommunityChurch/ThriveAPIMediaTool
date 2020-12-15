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
        }
    }
}