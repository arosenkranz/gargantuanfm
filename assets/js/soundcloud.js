$(document).ready(function(){
  
  SC.initialize({
    client_id: '8761e61199b55df39ee27a92f2771aeb'
  });

  var dataRef = firebase.database();
  var track = '';
  var query = '';
  var channelId;

  var trackList = [];

  $(document).on('click','.searchSubmit', function(e){
    e.preventDefault();
    $('.searchList').empty();
    query = $('#songName').val().trim();
    getUser();

  })

// Query songs from SoundCloud
  function getUser() {
    SC.get('/tracks', {
       q: query,
       limit: 30,
       order: 'hotness'
    }).then(function(tracks) {
      for (var i = 0; i < tracks.length; i++) {
        $('.searchList').append('<li><a class="button small song" data-value="' + tracks[i].id + '">' + tracks[i].user.username + " - " +  tracks[i].title + '</a></li>');
      }
    })
  };

// Gets song information based on clicked song, adds to Tracklist and appends to Picked Songs area for channel
  function addTrack() {
    SC.get('/tracks/' + track).then(function(player){
      $('audio').attr("src", player.stream_url + "?client_id=8761e61199b55df39ee27a92f2771aeb");
      console.log(track);
      trackList.push({
        id : player.id,
        trackName : player.title,
        url : player.stream_url,
        artist : player.user.username
      });
      $('.pickedSongs').append('<li><button class="button small success pickedSong" data-value="' + player.id + '">'+ player.title + '</button></li>');

    })
  };

  function loadChannel() {
    dataRef.ref('channels/' + channelId).once('value').then(function(snapshot){
      console.log(snapshot.val());
    })

  }

  $(document).on('click', '.song', function(){
     track = $(this).attr('data-value');
     $(this).addClass('hide');
     console.log(track);
     addTrack();

  });

  $(document).on('click','.pickedSong', function() {
    $(this).attr('data-value');
  })


  $(document).on('click','.channelCreate', function(e){
    e.preventDefault();
    var channelName = $('#channelName').val().trim();
    if (channelName != '' || trackList != '') {
      dataRef.ref().child('channels').push({
        channelName : channelName,
        tracks : trackList
      })
      trackList = [];
    }
    else {
      $('.error').css('display', 'block');
    }
  })

  dataRef.ref().child('channels').on('child_added', function(childSnapshot){
    console.log(childSnapshot.val());

    $('.channelList').prepend('<div class="small-4 columns"><a class="button large success channelButton" data-channel="' + childSnapshot.key + '">' + childSnapshot.val().channelName + '</a></div>');

    
  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });
  $(document).on('click','.channelButton', function(){
    channelId = $(this).data('channel').trim();
    console.log(channelId);
    loadChannel();
  });
  

});

