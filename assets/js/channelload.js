$(document).ready(function(){

  var channelId;
  var playlist = [];
  var artists = [];
  var trackNumber;
  var playlistName;
  var audio = document.querySelector('audio');

  dataRef.ref('channels').on('child_added', function(childSnapshot){
    // console.log(childSnapshot.val());
    $('.channelList').prepend('<div class="column column-block channelButton" data-equalizer-watch data-channel="' + childSnapshot.key + '">' + childSnapshot.val().channelName + '</div>');
  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });

  // When a channel is clicked, 
  $(document).on('click','.channelButton', function(){
    audio.pause();
    $('.current-time').css('opacity', '1');
    $('.logo').animate({opacity: '0'}, 'slow');
    $('.channelList').animate({opacity: '0'}, 'slow');
    $('.show-channels').html('Show Channels');
    $('.track-player').addClass('is-open');
    $('.display-buttons').animate({bottom: '15vh'}, 'fast')
    channelId = $(this).data('channel').trim();
    playlistName = "";
    artists = [];
    playlist = [];
    trackNumber = 0;
    console.log(channelId);
    setTimeout(loadChannel,1000);

  });

  // Pulls the selected channel's info and passes it into our audio element 
  function loadChannel() {
    dataRef.ref('channels/' + channelId).once('value').then(function(snapshot){
      playlistName = snapshot.val().channelName;
      //pulls selected channel's tracks 
      var channel = snapshot.val();
      var tracks = channel['tracks'];
      console.log(playlistName);
      console.log(channel);
      console.log(tracks);


      //pushes streaming urls into an array
      for(i = 0; i < tracks.length; i++){
        artists.push(tracks[i].artist + ' - ' + tracks[i].trackName);
        playlist.push(tracks[i].url);
      };

      console.log(playlist);

      //use html5 audio to play tracks
      function playTracks(){

        var trackUrl = playlist[trackNumber];
        var songInfo = artists[trackNumber];
        $('.song-info').html(songInfo);
        $('.playlist-info').html('NOW PLAYING: '+ playlistName);
        $('#play-pause').removeClass('fi-play').addClass('fi-pause');
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
        
      //function to play previous song
      function prevSong(){
        if (trackNumber > 0){
          audio.pause();
          trackNumber--;
          console.log(trackNumber);
          setTimeout(playTracks,1000);
        } else{
          replay();
        }
      } 

       //function to play next song
      function nextSong(){
        audio.pause();
        trackNumber++;
        console.log(trackNumber);
        setTimeout(playTracks,1000);
      }
     
      //replays playlist
      function replay() {
        audio.pause();
        trackNumber = 0;
        setTimeout(playTracks,1000);
      };

      //plays previous track when prevButton clicked
      $(document).on('click','#prevButton', function(){
        setTimeout(prevSong, 1500);
      });

      //plays next track when skipButton clicked
      $(document).on('click','#skipButton', function(){
        setTimeout(nextSong, 1500);
      });
        
    })
  };

});
  