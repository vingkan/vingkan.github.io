var videoElement = document.querySelector('video');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function successCallback(stream) {
  window.stream = stream; // make stream available to console
  videoElement.src = window.URL.createObjectURL(stream);
  //videoElement.play();
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}


MediaStreamTrack.getSources(function(sourceInfos) {
  var videoSourceId;
  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if(sourceInfo.kind == "video" && sourceInfo.facing == "environment") {
      videoSourceId = sourceInfo.id;
    }
  }
  var constraints = {
    audio: false,
    video: {
      optional: [{sourceId: videoSourceId}]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);
});


var video;
var scale = 2.0;
window.IMAGE_DATA = false;

var initialize = function() {
    video = $("#video").get(0);
    $("#video").click(captureImage);                
};

var captureImage = function() {
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext('2d')
          .drawImage(video, 0, 0, canvas.width, canvas.height);

    var imgData = canvas.toDataURL();
    /*var img = document.createElement("img");
    img.src = imgData;*/
    window.IMAGE_DATA = imgData;
    toggleById('camera');
    Editor.addPicture();
};

$(initialize);            
 
