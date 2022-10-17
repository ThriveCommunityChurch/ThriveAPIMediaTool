# Thrive API Media Tool
A CLI tool used to upload new media items to the Thrive Church Official API.

## Purpose
The idea behind this tool is to make it easier for the tech team to be able to upload new media items / series' to the [Thrive Church Official API](https://github.com/ThriveCommunityChurch/ThriveChurchOfficialAPI/). For the context of this application, that API is a "[black box](https://en.wikipedia.org/wiki/Black_box)". So we'll need to interface with that API but we don't need to be able to do anything other than call those routes with the correct information.

### Usage
There are 2 different options by which you can use this tool. You can either use it via the CLI or use the UI tool. This guide will outline the options for each method.

## UI Requirements
  This tool requires that you have node and the angluar CLI installed so that you can build and deploy this tool where you wish. However there is another required configuration file that you will need before you can use this app in a production deployment.
  
  You must create the following file located at this location `ThriveChurchMediaToolUI\src\environments\environment.prod.ts`.
  
  ```
export const environment = {
    production: true,
    apiURL: "http://hostname:port"
};
  ```
