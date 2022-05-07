# Thrive API Media Tool
A CLI tool used to upload new media items to the Thrive Church Official API.

## Purpose
The idea behind this tool is to make it easier for the tech team to be able to upload new media items / series' to the [Thrive Church Official API](https://github.com/ThriveCommunityChurch/ThriveChurchOfficialAPI/). For the context of this application, that API is a "[black box](https://en.wikipedia.org/wiki/Black_box)". So we'll need to interface with that API but we don't need to be able to do anything other than call those routes with the correct information.

### Usage
There are 2 different options by which you can use this tool. You can either use it via the CLI or use the UI tool. This guide will outline the options for each method.

<details>
  <summary>CLI [Deprecated]</summary>
  
  ## Arguments
Ordered by flag values ascending.

### Required
- `Date` (-d) - _The date this sermon message occurred._
- `Speaker` (-k) - _The speaker of the sermon message._
- `Title` (-t) - _The title of this sermon message._

### Optional
- `AudioUrl` (-a) - _The audio URL for the new message. (default = `null`)_
- `CloseSeries` (-c) - _Whether or not to close the requested series, ending it. Only used when updating an existing series. (default = `false`)_
- `SingleMessageSeries` (-e) - _Whether or not this new message is a single message series. Only used when creating a new series. (default = `false`)_
- `AudioFileSize` (-f) - _The file size of the message audio in MB. (default = `null`)_
- `Debug` (-g) - _Whether or not to run this tool in debug mode. Update & create operations will NOT complete if this setting is set. (default = `false`)_
- `AudioFilePath` (-h) - _The path to the audio file. Should be .mp3 file type. Cannot be used in conjunction with AudioFileSize or AudioDuration args. (default = `null`)_
- `ImageURL` (-i) - _The URL for the main sermon series image. Required when creating a new series. Must be in valid URL syntax. (default = `null`)_
- `ThumbnailURL` (-l) - _The URL for the compressed sermon series image. Required when creating a new series. Must be in valid URL syntax. (default = `null`)_
- `SeriesName` (-m) - _The name of the new series. Only used when creating a new series. (default = `null`)_
- `New` (-n) - _Whether or not this is a new series. Cannot be used in conjunction with SeriesId (s). (default = `false`)_
- `PassageRef` (-p) - _The main passage reference for this message. (default = `null`)_
- `SeriesId` (-s) - _The unique identifier of the series in which to add this media item to. (default = `null`)_
- `AudioDuration` (-u) - _The duration of the audio file in seconds. (default = `null`)_
- `VideoUrl` (-v) - _The URL of the video file for this message. (default = `null`)_
- `EndDate` (-y) - _The ending date of the series being updated. Used with the CloseSeries (c) argument. This argument is ignored if CloseSeries is false. (default = `null`)_


## Compatablity
__Source__

✔ macOS ✔ Windows ✔ Linux

__Release Packages__

❌ macOS ✔ Windows ❌ Linux

## Sample Requests
Each of the following are valid request parameters. Note that all arguments need to be strings including values that are numbers and URLs need to be included inside quotations so that slashes are not treated as escape characters. _When omitting the series ID from an update request you will be able to select a series ID from a list._

### Add new series message
```
-s "5fc59845325b6d1270e7affa" -a "https://example.com/Recording.mp3" -v "https://youtu.be/video-id" -u "2501.14666667" -f "28.6604251862" -p "Matthew 2: 13 - 23" -t "Ugly Childhood" -k "John Roth" -d "2020-12-27"
```

### Create a new series
```
-n true -m "An Ugly Christmas" -e false -a "https://example.com/Recording.mp3" -h "C:\file.mp3" -i "https://example.com/image.jpg" -l "https://example.com/thumbnail.jpg" -v "https://youtu.be/video-id" -d "2020-12-27" -k "John Roth" -p "Matthew 2: 13 - 23" -t "Ugly Childhood"
```

## Sample AppSettings
`ThriveAPIUrl` is the only required setting for this tool so that it knows where and how to communicate with the API. You can use this as an example for wherever you have your instance deployed. It should be public.
```
{
    "ThriveAPIUrl": "http://hostname:port/"
}
```

## Future Plans
The end goal for this tool is to make it a standalone application that can run on virtually any OS so that we can quickly run this either at home or on one of the servers at the church. That way we can quickly and easily calculate the data that we need and not have to spend time generating the JSON request to send via Postman to the API. This tool should take care of __all__ that heavy lifting for us. 
</details>

<details>
  <summary>UI</summary>
  
  ## Requirements
  This tool requires that you have node and the angluar CLI installed so that you can build and deploy this tool where you wish. However there is another required configuration file that you will need before you can use this app in a production deployment.
  
  You must create the following file located at this location `ThriveChurchMediaToolUI\src\environments\environment.prod.ts`.
  
  ```
export const environment = {
    production: true,
    apiURL: "http://hostname:port"
};
  ```
</details>
