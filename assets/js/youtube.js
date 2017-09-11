$(document).ready(function () {

  // --------------- Global Variables --------------------------
  // Create an object that stores playlist names & their id's
  const playlist_dict = {
    // "playlist name" : "playlist id",
    "North Lights": "PLYPNYHaAOM8ncN-jTgNY25aFAYeMOQl9C",
    "Party Background": "PLmDOmgjgiHsg9L_50qUKKeTYa3CR33o9s",
    "5sec": "PLYPNYHaAOM8l-LTJ3uhaLa-waAzXwfX_B",
    "Skinemax (SFW)": "PL024F8B35E0A4B3D0",
    "70's Commercials": "PL6475244FE97F6743",
    "80's Commercials": "PLC3458763E3A3C5A2",
    "90's Commercials": "PL0E12D3DB9229B41D",
    "Surf's Up, Brah": "PL99DENBqtCWMFvtTrhz23E4t7HeAmXFsx",
    "Aquarium": "PLYPNYHaAOM8nigxkVQuNXiFiMqjK1TtTI",
    "Night Sky": "PLYPNYHaAOM8nt2VItdWuFwyDwPsgNeNp4",
    "GoPro": "PLYPNYHaAOM8k7bRf00K5wLf72mnTttDS4",
    "Cats": "PLNXHyadglu_onSA7tfuWjJzPKKV7Fld1q",
    "Horror Movies": "PLNXHyadglu_qQnOE4UGw2h76BMsNOicwm",
    "Relaxing fires": "PLYPNYHaAOM8l0mSNUHryHpyNdgec4Sy4g",
  };
  var videos_array; // array of video objects!
  var currentVideoIndex = 0; // current index of the video
  var nextVideoIndex = 0;
  var next_mp4_url = "";

  var options = {
    volume: 9,
    loadSprite: false,
    autoplay: true,
    displayDuration: false,
    controls: [],
    debug: true,
  }

  var player = plyr.setup(document.querySelectorAll('.js-player'), options);
  $("#backgroundVideo").hide();

  player[0].on("ready", function () {
    $("#backgroundVideo").show();
    player[0].play();
    // player[0].toggleMute();
  })

  // ---------------------------------------------------------
  // this function will take the `playlist_dict`
  // & create buttons of the playlist names
  function createPlaylistButtons() {
    // 1. reference to where buttons will be appended to:
    var appendTarget = $("#channel-menu"); // *** CHANGE THIS TO REFERNCE where we will append to
    // 2. for each key-value pair in the playlist dictionary, create a button
    Object.keys(playlist_dict).map(function (key) {
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
  function playListButtonListener() {
    // Disable the skip button & change video channel button
    $(".channel-toggle").trigger("click");
    $(".playlist-btn-container > button").prop("disabled", true);
    // remove active-btn class to all buttons
    // & add active-btn to selected button
    $(".active-btn").removeClass("active-btn");
    $(this).addClass("active-btn");

    // reset the currentVideoIndex to zero & empty the array;
    currentVideoIndex = 0;
    nextVideoIndex = 0;
    next_mp4_url = "";
    videos_array = [];

    // Display the static.gif
    // $("#backgroundVideo").removeAttr("autoplay");
    // document.querySelector("#backgroundVideo").load();
    player[0].pause();
    // get the playlist id of the button clicked
    var playlist_id = $(this).data("id");
    var playlist_title = $(this).data("playlist");

    // Get the videos from the playlist
    getVideos_fromPlaylist(playlist_id, playlist_title);
  }

  // Event Listener - when video ends
  function playNext() {
    // Disable the skip button & change video channel button
    $(".playlist-btn-container > button").prop("disabled", true);
    // Display the static.gif
    // $("#backgroundVideo").removeAttr("autoplay");
    // document.querySelector("#backgroundVideo").load();
    // Increment currentVideoIndex
    currentVideoIndex++;
    if (currentVideoIndex >= videos_array.length) {
      currentVideoIndex = 0;
    };
    // Get the next videoId --> inorder to get the mp4 file format
    var video = videos_array[currentVideoIndex];
    var videoId = video.id;
    console.log(video)
    playVideo(videoId);
  }

  // ----------------------START: YOUTUBE API -----------------------------------
  // ----------- #1 getVideos_fromPlaylist()----------
  // 1. helper function -- this function gets the videos objs from youtube & stores
  // them in the global variable "videos_array"
  function getVideos_fromPlaylist(playlist_id, playlist_title) {
    const base_url = "https://www.googleapis.com/youtube/v3/playlistItems";
    $.ajax({
        cache: false,
        url: base_url,
        data: {
          key: "AIzaSyAG_qDOrWsTLs9Scfz_flwEciLYlo3_ZPI",
          part: "snippet",
          playlistId: playlist_id,
          maxResults: 50,
        },
        dataType: 'json',
        type: 'GET',
        timeout: 5000,
      })
      .done(function (response) {
        //  console.log(response);
        // 1. put videos in a list w. pertain data only
        var videos_list = response["items"].map(function (video) {
          var video_obj = {
            "title": video.snippet.title,
            "description": video.snippet.description,
            "id": video.snippet.resourceId.videoId,
            "playlist": playlist_title,
          };
          return video_obj;
        });
        // console.log(videos_list);
        // debugger;
        // 2. update the global copy of the video playlist
        videos_array = videos_list;
        // 3. Try to get the mp4 file of the first video
        console.log("this went")

        playVideo(videos_array[currentVideoIndex]["id"]); // function #2
      }) // closes .done promise
  }; // closes getVideos_fromPlaylist

  // // ----------- #2.5 getMp4file()----------
  // function next_Mp4(){
  //   var base_url = "http://localhost:3001/api/";
  //   // SECOND AJAX CALL --> get the next video's mp4 format
  //   // 1. Increment next video index
  //   nextVideoIndex = nextVideoIndex + 1;
  //   if (nextVideoIndex >= videos_array.length){
  //     nextVideoIndex = 0;
  //   };
  //   // console.log(nextVideoIndex);
  //   // console.log(videos_array);
  //   var nextTitle = videos_array[nextVideoIndex]["title"];
  //   var nextID = videos_array[nextVideoIndex]["id"];
  //   var next_request_url = base_url + nextID;

  //   // console.log("Getting the next mp4 file ...");
  //   // debugger; // Getting the next mp4 file ...
  //   $.ajax({
  //     url: next_request_url,
  //     dataType: "jsonp"
  //   }).done(function(response){
  //     // debugger; // 2nd AJAX call, successful response
  //     // console.log(response);
  //     // 1. Check to see if the response has an error
  //     if (response.hasOwnProperty("error")){
  //       console.warn(response);
  //       console.warn(videoID);
  //       // 2. If response has an error
  //       // Get the next video as next;
  //       debugger; // THERE WAS AN ERROR getting the next video!
  //       // getNextMp4();
  //       next_Mp4();
  //       // getMp4file(videos_array[currentVideoIndex]["id"]);
  //     } else {
  //     // 3. If no error, set the next_mp4_url to that url
  //       next_mp4_url = response["videoPath"];
  //       console.log(mp4_url)

  //       // console.log(response);
  //       // debugger; // successfully got the next mp4!
  //     }
  //   }); // closes ajax call
  // } // closes get next_mp4();

  // // ----------- #2 getMp4file()----------
  // function getMp4file(videoID){
  //     // console.log(videoID);
  //     // 1. make the proper url
  //     var base_url = "http://localhost:3001/api/";
  //     console.log(videoID)
  //     var request_url = base_url + videoID;
  //     // console.log(request_url);

  //     // 2a. if there is no mp4 file, make AJAX call to helloacm.com
  //     // console.log(next_mp4_url);
  //     if (next_mp4_url == ""){
  //       // console.log("No next_mp4 ...");
  //       // debugger; // No next_mp4 ...
  //       // i) FIRST AJAX CALL --> get the first video
  //       $.ajax({
  //         url: request_url,
  //         // dataType: "jsonp"
  //       })
  //       .done(function(response){
  //         console.log(response);
  //         if (response.hasOwnProperty("error")){
  //           console.warn(response);
  //           console.warn(videoID);
  //           // *PLAY NEXT VIDEO;
  //           currentVideoIndex ++;
  //           if (currentVideoIndex >= videos_array.length){
  //             currentVideoIndex = 0;
  //           };
  //           getMp4file(videos_array[currentVideoIndex]["id"]);
  //         } else {
  //           // 1. Get the proper url
  //           var mp4_url = response["videoPath"];
  //           console.log(mp4_url)
  //           // 2. call make video Element function
  //           playVideo(mp4_url);
  //         }

  //         // SECOND $.ajax request
  //         // debugger; // SECOND $.ajax request
  //         next_Mp4();

  //       }); // closes FIRST $.ajax request

  //     } // closes if statement

  //     // 2b. Else, THERE IS a mp4 url available use that!
  //     else {
  //       playVideo(next_mp4_url);
  //       next_mp4_url = ""; // reset it!
  //       // debugger; // there should be NO next_mp4_url

  //       next_Mp4();

  //       // debugger; // there should be a next_mp4_url :)
  //       // Now get the next ajax call

  //       // WORKING ON
  //       // var nextVideoIndex = currentVideoIndex + 1;
  //       // if (nextVideoIndex >= videos_array.length){
  //       //   nextVideoIndex = 0;
  //       // }
  //       // var nextID = videos_array[nextVideoIndex]["id"];
  //       // var next_request_url = base_url + nextID;
  //       // console.log("Getting the next mp4 file ...");
  //       // debugger;
  //       // $.ajax({
  //       //   url: request_url,
  //       //   dataType: "json"
  //       // }).done(function(response){
  //       //   console.log("SUCCESS");
  //       //   console.log(response);
  //       // }); // closes ajax call

  //     } // closes else statement


  // }; // closes getMp4file function;

  // ----------- #3 playVideo()----------
  function playVideo(url) {
    // change the video src to load the new video
    console.log(url)
    // turn autoplay back on
    // document.querySelector("#backgroundVideo").load();
    $("#backgroundVideo").hide();

    $("#backgroundVideo").attr("data-video-id", url);
    player[0].source({
      type: 'video',
      title: "whatever",
      sources: [{
        src: url,
        type: 'youtube'
      }]
    });

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
    Object.keys(playlist_btn_array).forEach(function (index) {
      if ($(playlist_btn_array[index]).data("playlist") == current_playlist) {
        // console.log(playlist_btn_array[index]);
        $(playlist_btn_array[index]).addClass("active-btn");
      }
    });
    // Re-active the skip button & change playlist, after one second
    window.setTimeout(function () {
      $(".playlist-btn-container > button").prop("disabled", false);
    }, 1000);
  }

  // ---------------------- END: YOUTUBE API -----------------------------------

  // --------------- Event Listener --------------------------

  // console.log("Called from document.ready()");
  // 1.  create buttons for each of the playlist
  createPlaylistButtons();
  // 2. event listener for playlist button
  $(document).on("click", ".playlist-btn", playListButtonListener);


  // 3. event listener for when video finished
  player[0].on("ended", playNext);

  // 4. event listener to skip current video
  $("button#nextVideo").on("click", playNext);
  $("button#muteVideo").on("click", function () {
    player[0].toggleMute();
    var buttonState = $(this).text();

    if (buttonState === "Mute Video") {
      $(this).text("Unmute Video");
    } else {
      $(this).text("Mute Video");
    }
  });

  setTimeout(function () {
    $("button#muteVideo").click();

  }, 3000)
  // 5. Default just play videos from nature?
  // COMMENT OUT LATER
  getVideos_fromPlaylist("PLYPNYHaAOM8ncN-jTgNY25aFAYeMOQl9C", "North Lights");

  // 6. catch video errors 
  $("video").on("error", function () {
    // debugger;
    console.warn("VIDEO CAN'T BE PLAYED --- playing the next one");
    // console.warn($(this).val("src"));
    playNext();
  })
}); // closes document.ready