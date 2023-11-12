<p align="center">
  <img src="https://user-images.githubusercontent.com/22202975/205743304-073fb721-7ca3-4b52-a132-f397452f2e99.png" data-canonical-src="https://user-https://user-images.githubusercontent.com/22202975/205743304-073fb721-7ca3-4b52-a132-f397452f2e99.png" target="_blank">
 </p>

# Thrive API Media Tool
A CLI tool used to upload new media items to the Thrive Church Official API.

## Purpose
The idea behind this tool is to make it easier for the tech team to be able to upload new media items / series' to the [Thrive Church Official API](https://github.com/ThriveCommunityChurch/ThriveChurchOfficialAPI/). For the context of this application, that API is a "[black box](https://en.wikipedia.org/wiki/Black_box)". So we'll need to interface with that API but we don't need to be able to do anything other than call those routes with the correct information.

### Usage
In order to use this tool you will need to install Angular on your system. This is the framework we've chosen to buld the UI. Whether you wish to run this on your own servers or deploy this via the cloud provider of your choice, Angluar will allow you to package your UI into something easy to use. Take a look at their latest documentation on their website. We also use Bootstrap as the design library to make building the application much easier.

## UI Requirements
  This tool requires that you have node and the angluar CLI installed so that you can build and deploy this tool where you wish. However there is another required configuration file that you will need before you can use this app in a production deployment.
  
  You must create the following file located at this location `ThriveChurchMediaToolUI\src\environments\environment.prod.ts`.
  
  ```
export const environment = {
    production: true,
    apiURL: "http://hostname:port"
};
  ```
  
## Screenshots
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/c8d24d38-528a-4d4e-a914-c38f90f18d10" width="100%">
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/4c78a591-52a5-4405-aab2-fd37ff6b22de" width="100%">
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/7c89b9a8-877f-400e-81cb-650238c9eb2a" width="100%">
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/1b95cfe0-1254-4e61-aa9e-a47f8e92f182" width="100%">
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/007e057f-4da2-4dee-9109-c590ff855e2e" width="100%">
