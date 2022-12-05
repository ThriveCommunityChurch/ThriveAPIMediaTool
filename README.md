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
![image](https://user-images.githubusercontent.com/22202975/205739159-096eb0bb-5f23-4819-8ea0-0cc860f530d8.png)
![image](https://user-images.githubusercontent.com/22202975/205739389-20952d2c-6b95-497d-9b1c-9912ed828786.png)

