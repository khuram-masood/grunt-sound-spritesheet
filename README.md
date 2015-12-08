# grunt-sound-spritesheet

> Combines audio files into one audio file and creates json data for cue points.

# supported formats
    * mp3
    * ogg


> Compatabile with Howlerjs

## Getting Started


If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sound-spritesheet --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sound-spritesheet');
```

## The "soundSpritesheet" task

### Overview
In your project's Gruntfile, add a section named `soundSpritesheet` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  soundSpritesheet: {
    options: {
      audioDir: './audioFiles',
      outputDir: 'output',
      outputFileName:'big.mp3',
      outputFormat:'mp3'
    }
  },
});
```

### Options

#### options.audioDir
Type: `String`
required

Path to audio files

#### options.outputDir
Type: `String`
required

#### options.outputFileName
Type: `String`
required

#### options.outputFormat
Type: `String`
required

file format . Either mp3 or ogg for now.

### Usage Examples

```js
grunt.initConfig({
  soundSpritesheet: {
    options: {
      audioDir: './audioFiles',
      outputDir: 'output',
      outputFileName:'bingo.ogg',
      outputFormat:'ogg'
    }
  },
});

### Sample generated Json data file
each entry starts with the file name in spriteSheet and have start point and end points in an array

```js
{
    "1": [
        0,
        2116.8999999999996
    ],
    "2": [
        6740.81723356009,
        2430.4
    ],
    "laser": [
        9171.21723356009,
        2221.4
    ],
    "test": [
        11392.61723356009,
        2848.3
    ]
}

### Usage with Howler

```js
var sound = new Howl({
  urls: ['bingo.mp3'],
  sprite: path-to-json-object-file
});

// shoot the laser!
sound.play('laser');

## Release History
_(0.1.0)_

## Future plan
* more audio formats
* ability to add silence gap between audio files

