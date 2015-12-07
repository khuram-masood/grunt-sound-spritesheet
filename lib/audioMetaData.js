/**
 * Created by khuram.masood on 03/12/15.
 */

var fs = require('fs');
var mm = require('musicmetadata');
var events = require('events');

module.exports.AudioMetaData = function(){

    var metaDataReady = new events.EventEmitter();

    function getDuration(file){

        var audioStream = fs.createReadStream(file);
        var metaInfo;

        audioStream.on('close',  function () {
            metaDataReady.emit('done', metaInfo);
        });

        var parser = mm(audioStream , {duration: true}, function (err, metadata) {
            if (err) throw err;
            metaInfo = metadata;
    });

    }

    return {
        metaDataReady : metaDataReady,
        getDuration : getDuration
    }



}
