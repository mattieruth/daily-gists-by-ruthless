# mattie ruth's gists for testing daily calls

99% of the time i use `basic-call-object.html` which just makes a simple call
object instance and puts it and some handy variables on the window for
manually joining a call or running various commands. I prefer using extremely
basic html + javascript gists like these for testing to remove all sorts of
variables while debugging.

## Setup

Setup your favorite rooms for testing:

```bash
$ cp _roomInfo.js.template _roomInfo.js
```

Then modify \_roomInfo.js to add/change room urls and tokens you like to use for
testing along with your API keys for some of the gists that will generate
tokens for you. This will keep all this sensitive info local and out of this
repo :)

## Running

1. Serve up this folder

```bash
$ ./run_server <port>
```

2. The above will open the folder in your browser. Simply find the gist you want
   to work with

## Changing your room or adding a token

Just change which room `window.ROOM_URL` points to or `window.JOIN_TOKEN` points
to in your `_roomInfo.js` file.

## Changing your daily-js version

In [`commonGistUtil`](./commonGistUtils.js#L18-L21), update the `importDaily()` lines to specify either `'local'` (to look for a local copy of daily.js), `'latest'` (to pull from unkpg.com the most recently published release), or `0.x.y` (to pull a specific released version).

## Running in an embedded iFrame

Most of the gists in this repo support running in either call object mode or using prebuilt in an embedded iFrame. To run embedded, simply add `?prebuilt=1` to the end of your file url.

```
http://localhost:3050/basic-call-object.html?prebuilt=1
```