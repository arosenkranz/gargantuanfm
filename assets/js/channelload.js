
  var channelId;
  var playlist = [];
  var trackNumber;

  dataRef.ref('channels').on('child_added', function(childSnapshot){
    // console.log(childSnapshot.val());
    $('.channelList').prepend('<div class="column column-block"><a class="button large success channelButton" data-channel="' + childSnapshot.key + '">' + childSnapshot.val().channelName + '</a></div>');
  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });

  // When a channel is clicked, 
  $(document).on('click','.channelButton', function(){
    channelId = $(this).data('channel').trim();
    playlist = [];
    trackNumber = 0;
    console.log(channelId);
    loadChannel();

  });

  // Pulls the selected channel's info and passes it into our audio element 
  function loadChannel() {
    dataRef.ref('channels/' + channelId).once('value').then(function(snapshot){

      //pulls selected channel's tracks 
      var channel = snapshot.val();
      var tracks = channel['tracks'];

      console.log(channel);
      console.log(tracks);


      //pushes streaming urls into an array
      for(i = 0; i < tracks.length; i++){
        playlist.push(tracks[i].url);
      };

      console.log(playlist);

      //use html5 audio to play tracks
      function playTracks(){

        var trackUrl = playlist[trackNumber];

        if (trackNumber < playlist.length) {

          $('audio').attr("src", trackUrl + "?client_id=8761e61199b55df39ee27a92f2771aeb");
          $('audio').get(0).play();
          $('audio').get(0).onended = function(){
            nextSong();
          }
        } else {
          replay();

        }
      };


      playTracks();

      //keeps same function from running before previous call is finished
      function debounce(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      };
        
      //function to play previous song
      var prevSong = debounce(function(){
        if (trackNumber < 0){
          trackNumber--;
          playTracks();
        } else{
          replay();
        }
      }, 250);

      window.addEventListener('resize', prevSong);   

       //function to play next song
      var nextSong = debounce(function(){
        trackNumber++;
        playTracks();
      }, 250);

      window.addEventListener('resize', nextSong);

      //replays playlist
      function replay() {
        trackNumber = 0;
        playTracks();
      };

      //plays previous track when prevButton clicked
      $(document).on('click','#prevButton', function(){
        prevSong();
      });

      //plays next track when skipButton clicked
      $(document).on('click','#skipButton', function(){
        nextSong();
      });
        
    })
  };
  

