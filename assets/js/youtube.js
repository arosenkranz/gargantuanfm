// 0. Create an object that stores playlist names & their id's
const playlist_dict = {
  // "playlist name" : "playlist id",
  "North Lights": "PLYPNYHaAOM8ncN-jTgNY25aFAYeMOQl9C",
};
var currentVideos; // array of video objects!
var current_video_index = 0; // current index of the video

// ------------------------------------------------------------------
// 1. Given the playlist name --> get an array of the videos
var base_url = "https://www.googleapis.com/youtube/v3/playlistItems";
var playlist_id = "PLYPNYHaAOM8ncN-jTgNY25aFAYeMOQl9C";
/* this function
* @param {string} playlistName - the name of the playlist that you want to play
*/
getVideos_fromPlaylist(playlist_id); // TESTING
function getVideos_fromPlaylist(playlistName){
  // Get a cat video or some sorts
  $.ajax({
     cache: false,
     url: base_url,
     data: {
       key: API_KEY,
       part: "snippet",
       playlistId: playlist_id,
     },
     dataType: 'json',
     type: 'GET',
     timeout: 5000,
   })
   .done(function(response){
    //  console.log(response);
    // 1. put videos in the playlist into an array
    var videos = response.items;
    var videos_list = videos.map(function(video){
      var video_obj = {
        "title" : video.snippet.title,
        "description" : video.snippet.description,
        "id" : video.snippet.resourceId.videoId,
        "playlist": playlistName,
      };
      return video_obj;
    });
    // console.log(videos_list);
    // 2. update the global copy of the video playlist
    currentVideos = videos_list;

    // 3. Call the play videos
    playVideos();

  }) // closes .done promise
}; // closes getVideos_fromPlaylist

// ------------------------------------------------------------------
// 3.
function playVideos(){
  // console.log(currentVideos);
  // debugger;
  getMp4file(currentVideos[current_video_index]["id"]);

  // check to see if the index is maxed out, then reset to 0
  current_video_index ++;
  if (current_video_index == currentVideos.length){
    current_video_index = 0;
  }
}

// ------------------------------------------------------------------
function makeVideoElement(url_mp4){
  // console.log("Yo");
  // 1. Make video element & source with jQuery
  var videoElement = $("<video playsinline autoplay muted>")
                      .attr("id", "backgroundVideo")
                      .attr("poster", "assets/images/static.gif");
                      // .attr("index", index);

  var source = $("<source>")
                .attr("src", url_mp4)
                .attr("type", "video/mp4");

  // 2. Append source to video
  videoElement.append(source);

  // 3. Get rid of the previous video element
  $("video").remove();

  // 4. Append video to body
  $("body").prepend(videoElement);
}

/* this function when given a videoID from youtube will get the mp4 file url
* @param videoID {string} - a string of the youtube videoID
* TO DO!!! Check if valid url there should not be a 'error' key
*/
function getMp4file(videoID){
  // console.log(videoID);
  // 1. make the proper url
  var base_url = "https://helloacm.com/api/video/?cached&video=https://www.youtube.com/watch?v=";
  var request_url = base_url + videoID;
  // console.log(request_url);

  // 2. make AJAX call to helloacm.com
  $.ajax({
    url: request_url,
    dataType: "json"
  })
  .done(function(response){
    // console.log(response);
    if (response.hasOwnProperty("error")){
      console.warn(response);
      console.warn(videoID);
      // debugger;
      // PLAY NEXT VIDEO;
      current_video_index ++;
      if (current_video_index == currentVideos.length){
        current_video_index = 0;
      };
      getMp4file(currentVideos[current_video_index]["id"]);
    } else {
      // 1. Get the proper url
      var mp4_url = response["url"];
      // 2. call make video Element function
      makeVideoElement(mp4_url);
    }


  });
}; // closes getMp4file function


// // 4.
// $("video").on("onended", function(){
//   console.log(this["id"]);
// });