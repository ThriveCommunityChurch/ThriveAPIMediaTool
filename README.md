# Thrive API Media Tool
A tool used to upload new media items to the Thrive Church Official API.

## Purpose
The idea behind this tool is to make it easier for the tech team to be able to upload new media items / series' to the [Thrive Church Official API](https://github.com/ThriveCommunityChurch/ThriveChurchOfficialAPI/). For the context of this application, that API is a "[black box](https://en.wikipedia.org/wiki/Black_box)". So we'll need to interface with that API but we don't need to be able to do anything other than call those routes with the correct information.

## Arguments
- `New` (-n) - _Whether or not this is a new series. (default = `false`)_
- `SeriesId` --s) - _The unique identifier of the series in which to add this media item to. (default = `null`)_
- `AudioUrl` (-a) - _The audio URL for the new message. (default = `null`)_
- `AudioDuration` (-u) - _The duration of the audio file in seconds. (default = `null`)_
- `AudioFileSize` (-f) - _The file size of the message audio in MB. (default = `null`)_
- `VideoUrl` (-v) - _The URL of the video file for this message. (default = `null`)_
- `PassageRef` (-p) - _The main passage reference for this message. (default = `null`)_
- `Speaker` (-k) - __Required.__ _The speaker of the sermon message._
- `Title` (-t) - __Required.__ _The title of this sermon message._
- `Date` (-d) - __Required.__ _The date this sermon message occurred._

## Sample Requests
Each of the following are valid request parameters. Note that all arguments need to be strings including values that are numbers and URLs need to be included inside quotations so that slashes are not treated as escape characters. _When omitting the series ID from an update request you will be able to select a series ID from a list._

## Compatablity
__Source__

✔ macOS ✔ Windows ✔ Linux

__Release Packages__

❌ macOS ✔ Windows ❌ Linux

### Add new series message
```
-s "5fc59845325b6d1270e7affa" -a "https://thrive-fl.org/wp-content/uploads/2020/12/2020-12-27-Recording.mp3"  -v "https://youtu.be/397LDrfUCJ0" -u "2501.14666667" -f "28.6604251862" -p "Matthew 2: 13 - 23" -t "Ugly Childhood" -k "John Roth" -d "2020-12-27" -n false
```

### Create a new series
_Coming soon, not yet supported_

## Sample AppSettings
`ThriveAPIUrl` is the only required setting for this tool so that it knows where and how to communicate with the API. You can use this as an example for wherever you have your instance deployed. It should be public.
```
{
    "ThriveAPIUrl": "http://hostname:port/"
}
```
