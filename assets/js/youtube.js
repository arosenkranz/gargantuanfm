// --------------- Global Variables --------------------------
// Create an object that stores playlist names & their id's
const playlist_dict = {
  // "playlist name" : "playlist id",
  "North Lights": "PLYPNYHaAOM8ncN-jTgNY25aFAYeMOQl9C",
  "Party Background": "PLmDOmgjgiHsg9L_50qUKKeTYa3CR33o9s",
  "test123": "PLYPNYHaAOM8l-LTJ3uhaLa-waAzXwfX_B",
  "Skinemax (SFW)": "PL024F8B35E0A4B3D0",
  "Disney Channel Promos": "PL3296A205B81429C8",
  "70's Commercials": "PL6475244FE97F6743",
  "80's Commercials": "PLC3458763E3A3C5A2",
  "90's Commercials": "PL0E12D3DB9229B41D",
  "Surf's Up, Brah": "PL99DENBqtCWMFvtTrhz23E4t7HeAmXFsx",
  "Aquarium": "PLYPNYHaAOM8nigxkVQuNXiFiMqjK1TtTI",
  "Night Sky": "PLYPNYHaAOM8nt2VItdWuFwyDwPsgNeNp4",
  "GoPro": "PLYPNYHaAOM8k7bRf00K5wLf72mnTttDS4",
};
var videos_array; // array of video objects!
var currentVideoIndex = 0; // current index of the video

// ---------------------------------------------------------
// this function will take the `playlist_dict`
// & create buttons of the playlist names
function createPlaylistButtons(){
  // 1. reference to where buttons will be appended to:
  var appendTarget = $("#channel-menu"); // *** CHANGE THIS TO REFERNCE where we will append to
  // 2. for each key-value pair in the playlist dictionary, create a button
  Object.keys(playlist_dict).map(function(key){
    // console.log(`${key}: ${playlist_dict[key]}`);
    // create a button for each playlist
    var btn = $("<button>")
      .addClass("playlist-btn button small")
      .data("id", playlist_dict[key])
      .data("playlist", key)
      .html(key);
    // append the created btn to the Target
    appendTarget.append(btn);
  }); // closes map function
}

// Event listener function when the button gets selected
function playListButtonListener(){
  // Disable the skip button & change video channel button
  $(".playlist-btn-container > button").prop("disabled", true);
  // remove active-btn class to all buttons
  // & add active-btn to selected button
  $(".active-btn").removeClass("active-btn");
  $(this).addClass("active-btn");
  $(".channel-toggle").trigger("click");

  // reset the currentVideoIndex to zero & empty the array;
  currentVideoIndex = 0;
  // Display the static.gif
  $("#backgroundVideo").removeAttr("autoplay");
  document.querySelector("#backgroundVideo").load();
  // get the playlist id of the button clicked
  var playlist_id = $(this).data("id");
  var playlist_title = $(this).data("playlist");

  // Get the videos from the playlist
  getVideos_fromPlaylist(playlist_id, playlist_title);
}

// Event Listener - when video ends
function playNext(){
  // Disable the skip button & change video channel button
  $(".playlist-btn-container > button").prop("disabled", true);
  // Display the static.gif
  $("#backgroundVideo").removeAttr("autoplay");
  document.querySelector("#backgroundVideo").load();
  // Increment currentVideoIndex
  currentVideoIndex ++;
  if (currentVideoIndex >= videos_array.length){
    currentVideoIndex = 0;
  };
  // Get the next videoId --> inorder to get the mp4 file format
  var video = videos_array[currentVideoIndex];
  var videoId = video.id;
  getMp4file(videoId);
}

// ----------------------START: YOUTUBE API -----------------------------------
// ----------- #1 getVideos_fromPlaylist()----------
// 1. helper function -- this function gets the videos objs from youtube & stores
// them in the global variable "videos_array"
function getVideos_fromPlaylist(playlist_id, playlist_title){
  const base_url = "https://www.googleapis.com/youtube/v3/playlistItems";
  $.ajax({
     cache: false,
     url: base_url,
     data: {
       key: API_KEY,
       part: "snippet",
       playlistId: playlist_id,
       maxResults: 50,
     },
     dataType: 'json',
     type: 'GET',
     timeout: 5000,
   })
   .done(function(response){
    //  console.log(response);
    // 1. put videos in a list w. pertain data only
    var videos_list = response["items"].map(function(video){
      var video_obj = {
        "title" : video.snippet.title,
        "description" : video.snippet.description,
        "id" : video.snippet.resourceId.videoId,
        "playlist": playlist_title,
      };
      return video_obj;
    });
    // console.log(videos_list);
    // debugger;
    // 2. update the global copy of the video playlist
    videos_array = videos_list;
    // 3. Try to get the mp4 file of the first video
    getMp4file(videos_array[currentVideoIndex]["id"]); // function #2
  }) // closes .done promise
}; // closes getVideos_fromPlaylist

// ----------- #2 getMp4file()----------
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
        // *PLAY NEXT VIDEO;
        currentVideoIndex ++;
        if (currentVideoIndex >= videos_array.length){
          currentVideoIndex = 0;
        };
        getMp4file(videos_array[currentVideoIndex]["id"]);
      } else {
        // 1. Get the proper url
        var mp4_url = response["url"];
        // 2. call make video Element function
        playVideo(mp4_url);
      }
    });
}; // closes getMp4file;

// ----------- #3 playVideo()----------
function playVideo(url){
  // change the video src to load the new video
  $("#backgroundVideo").attr("src", url);
  // turn autoplay back on
  $("#backgroundVideo").prop("autoplay", true);
  // debugger;
  document.querySelector("#backgroundVideo").load();
  var video = videos_array[currentVideoIndex];
  var current_playlist = video["playlist"];
  // DEVELOPMENT - testing code below:
  console.info("Current Video Information");
  console.info(video);
  console.info("--------------------------");
  // update the video info & highlight playlist
  $('.video-info').html('NOW WATCHING: ' + video.title);
  $(".active-btn").removeClass("active-btn");
  // Get all the playlist buttons & check which one has a matching name
  var playlist_btn_array = document.querySelectorAll(".playlist-btn");
  Object.keys(playlist_btn_array).forEach(function(index){
    if ($(playlist_btn_array[index]).data("playlist") == current_playlist){
      // console.log(playlist_btn_array[index]);
      $(playlist_btn_array[index]).addClass("active-btn");
    }
  });
  // Re-active the skip button & change playlist, after one second
  window.setTimeout(function(){
    $(".playlist-btn-container > button").prop("disabled", false);
  }, 1000);
}

// ---------------------- END: YOUTUBE API -----------------------------------

// --------------- Event Listener --------------------------
$(document).ready(function(){
  // console.log("Called from document.ready()");
  // 1.  create buttons for each of the playlist
  createPlaylistButtons();
  // 2. event listener for playlist button
  $(document).on("click", ".playlist-btn", playListButtonListener);


  // 3. event listener for when video finished
  $("video").on("ended", playNext);

  // 4. event listener to skip current video
  $("button#nextVideo").on("click", playNext);

  // 5. Default just play videos from nature?
  // COMMENT OUT LATER
  getVideos_fromPlaylist("PLYPNYHaAOM8ncN-jTgNY25aFAYeMOQl9C", "North Lights");
}); // closes document.ready
