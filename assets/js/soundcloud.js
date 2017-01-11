$(document).ready(function(){
  

  var track = '';
  var query = '';
  var trackList = [];
  var song = document.querySelector('audio');
  console.log(song);

  $(document).on('click','.search-submit', function(e){
    e.preventDefault();
    $('.search-list').empty();
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
        $('.search-list').append('<li class="column column-block"><a class="button small song" data-value="' + tracks[i].id + '">' + tracks[i].user.username + " - " +  tracks[i].title + '</a></li>');
      }
    })
  };

// Gets song information based on clicked song, adds to Tracklist and appends to Picked Songs area for channel
  function addTrack() {
    SC.get('/tracks/' + track).then(function(player){
      
      console.log(track);
      trackList.push({
        id : player.id,
        trackName : player.title,
        url : player.stream_url,
        artist : player.user.username
      });

      $('.picked-songs').append('<li class="column column-block"><button class="button small success picked-song" data-value="' + player.id + '">'+ player.title + '</button></li>');
    })
    $('#songName').attr('placeholder','Search for another song or artist!')
  };

  // grabs selected song's value and sends it through addTrack function
  $(document).on('click', '.song', function(){
     track = $(this).attr('data-value');
     $(this).addClass('hide');
     console.log(track);
     addTrack();
  });

  // If we want to allow removal of tracks in list before channel creation, not quite figured out yet
  $(document).on('click','.pickedSong', function() {
    $(this).attr('data-value');
  })

  // Create channel button, still need to add some functionality to it
  $(document).on('click','.channel-create', function(e){
    e.preventDefault();
    var channelName = $('#channel-name').val().trim();

    // Make sure user enters both a channel name and tracklist
    if (channelName != '' && trackList.length > 0) {
      dataRef.ref().child('channels').push({
        channelName : channelName,
        tracks : trackList
      })
      trackList = [];
      $('.pickedSongs').html('<h3>Congrats on your new Gargantuan station!</h3>');
      $('.search-list').empty();
    }
    else {
      $('.callout').css('display', 'block');
    }
  });

  // Reset button
  $(document).on('click','.reset', function() {
    tracklist = [];
    console.log(tracklist);
    $('.picked-songs').empty();
    $('.search-list').empty();
  })

  $(document).on('click', '#play-pause', function(){
    
    if($(this).hasClass('fi-pause')) {
      $(this).removeClass('fi-pause')
      .addClass('fi-play');
      song.pause();
    }
    else if ($(this).hasClass('fi-play')) {
      $(this).removeClass('fi-play')
      .addClass('fi-pause');
      song.play();
    }
  });


  function currentTime() {
    var song = document.querySelector('audio');
    var time = Math.floor(song.currentTime);
   
    var momentTime = moment().minute(0).seconds(time).format("mm:ss");
    $('.current-time').html(momentTime);
  }

  setInterval(currentTime, 0);

  $(".show-button").on("click", function() {
    if ($('.show-button').html() === "Close Player"){
      $('.show-button').html('Open Player');
      $('.display-buttons').animate({bottom: '0'}, 'fast')
    }
    else if ($('.show-button').html() === "Open Player") {
      $('.show-button').html('Close Player');
      $('.display-buttons').animate({bottom: '15vh'}, 'fast')
    }
  });

  $(".show-channels").on("click", function() {
    if ($('.show-channels').html() === 'Hide Channels'){
      $('.show-channels').html('Show Channels');
      $('.logo').animate({opacity: '0'}, 'slow');
      $('.channelList').animate({opacity: '0'}, 'slow');
    }
    else if ($('.show-channels').html() === 'Show Channels') {
      $('.show-channels').html('Hide Channels');
      $('.logo').animate({opacity: '1'}, 'slow');
      $('.channelList').animate({opacity: '1'}, 'slow');

    }
  });


});