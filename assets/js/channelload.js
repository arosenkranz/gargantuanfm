
  var channelId;
  var playlist = [];
  var trackNumber = 0;

  dataRef.ref('channels').on('child_added', function(childSnapshot){
    // console.log(childSnapshot.val());
    $('.channelList').prepend('<div class="column column-block"><a class="button large success channelButton" data-channel="' + childSnapshot.key + '">' + childSnapshot.val().channelName + '</a></div>');
  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });

  // When a channel is clicked, 
  $(document).on('click','.channelButton', function(){
    channelId = $(this).data('channel').trim();
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


      //pushes streaming urls to an array
      for(i = 0; i < tracks.length; i++){
        playlist.push(tracks[i].url);
      };

      console.log(playlist);
      playTracks();
       
      //use html5 audio to play tracks
      function playTracks(){

        var trackUrl = playlist[trackNumber];

        if (trackNumber < playlist.length) {

          $('audio').attr("src", trackUrl + "?client_id=8761e61199b55df39ee27a92f2771aeb");
          $('audio').onended = function(){
            nextSong();
          }
        } else {
          replay();

        }
      }

      function nextSong(){
        trackNumber++;
        playTracks();
      }

      function replay{
        trackNumber = 0;
        playTracks();
      }
    
    })
  }
  

