/*
 * grunt-sound-spritesheet
 * grunt-sound-spritesheet
 *
 * Copyright (c) 2015 Khuram Masood
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var files;
var audioFiles = [];
var  meta = [];
var  audioMetaDataList = [];
var  sprite = {};
var  stream;
var  currentfile;
var  spriteSheet;
var  outputJsonFile;

var jsonfile = require('jsonfile');
var events = require('events');
var audioMetaData = require('../lib/audioMetaData').AudioMetaData();
var allMetaExtracted = new events.EventEmitter();
var totalFiles;



module.exports = function(grunt) {


  grunt.registerTask('soundSpritesheet', 'Combines audio files into one audio file and creates json data for cue points.', function() {

      var done = this.async();
      jsonfile.spaces = 4;

      var throwError = function(error){
          grunt.log.error(error);
          done(false);
      };

      var options = this.options({
        audioDir: ' ',
        outputDir: '',
        outputFileName:'',
        outputFormat:''
    });

      for(var option in options){
          if(options[option] === '' || options[option] === null){
              throwError('Option **'+option+'** is missing');
          }
      }

      if(!grunt.file.isDir(options.audioDir)){
          throwError('Audio Directory does not exist');
      }

      if(!grunt.file.isDir(options.outputDir)){
          grunt.file.mkdir(options.outputDir);
      }

      files             = fs.readdirSync(options.audioDir);
      outputJsonFile    = options.outputFileName.split(".")[0];


      var init = function(){

          files
              .filter(function(file) {
                  if(file.substr(-3) === ('ogg') || file.substr(-3) === ('mp3')){
                      return true;
                  }
              })
              .forEach(function (file) {
                  audioFiles.push(file);
                  meta.push(file);
              });

          if(audioFiles.length){
              getMeta();
          }else{
              throwError('No MP3 or OGG files found in'+' '+options.audioDir);
          }

      };

      var getMeta = function(){

          if(!meta.length){
              allMetaExtracted.emit('allMetaCompleted');
              return;
          }
          else{
              audioMetaData.getDuration(options.audioDir+'/'+meta[0]);
              audioMetaData.metaDataReady.on("done",onAudioMetaReceived);
          }
      };

      var onAudioMetaReceived = function (args){
          var metadata = {"title":args.title, "duration":args.duration};
          audioMetaDataList.push(metadata);
          meta.shift();
          audioMetaData.metaDataReady.removeListener("done",onAudioMetaReceived);
          getMeta();
      };

      var createCuePoints = function (){
          var start = 0;
          var end   = 0;
          audioMetaDataList.forEach(function(data){
              end = data.duration * 1000; //millisecs
              sprite[data.title] = [start,end];
              start += data.duration * 1000;
          });
      };

      var createSpriteSound = function(){
          spriteSheet = fs.createWriteStream(options.outputDir+'/'+options.outputFileName);
          totalFiles = audioFiles.length;
          assembleSpriteSheet();
      };

      var createJsonData = function (){
          jsonfile.writeFile(options.outputDir+"/"+outputJsonFile+"SpriteData.json", sprite, function (err) {
              if(err) {
                  throwError(err);
                  return;
              }
              createSpriteSound();
          });
      };


      var onMetaCompleted = function(){
          createCuePoints();
          createJsonData();
      };


      var assembleSpriteSheet = function () {
          if (!audioFiles.length) {
              spriteSheet.end("Done");
              grunt.log.ok(totalFiles+' audio files merged');
              done(true);
              return;
          }
          currentfile = options.audioDir + '/' + audioFiles.shift();
          stream = fs.createReadStream(currentfile);

          stream.pipe(spriteSheet, {end: false});
          stream.on("end", function () {
              assembleSpriteSheet();
          });
      };

      allMetaExtracted.on('allMetaCompleted',onMetaCompleted);
      init();


  });

};
