$(document).ready(function(){
  

  var track = '';
  var query = '';
  var trackList = [];
  var song = document.querySelector('audio');
  var channelNameCheck = [];
  


  $(document).on('click','.search-submit', function(e){
    e.preventDefault();
    $('.search-list').empty();
    query = $('#songName').val().trim();
    getSC();
  })

// Query songs from SoundCloud
  function getSC() {
    SC.get('/tracks', {
       q: query,
       limit: 50,
       order: 'hotness'
    }).then(function(tracks) {
      $('.search-list').empty();
      for (var i = 0; i < tracks.length; i++) {
        $('.search-list').append('<div class="column column-block" data-equalizer-watch><a class="button small song" data-value="' + tracks[i].id + '">' + tracks[i].user.username + " - " +  tracks[i].title + '</a></div>');
      }
    })
  };

// Gets song information based on clicked song, adds to Tracklist and appends to Picked Songs area for channel
  function addTrack() {
    SC.get('/tracks/' + track).then(function(player){
      
      trackList.push({
        id : player.id,
        trackName : player.title,
        url : player.stream_url,
        artist : player.user.username
      });

      if (trackList.length === 1) {
        $('.picked-songs').empty();
      }
      $('.picked-songs').append('<li class="column column-block"><button class="button small picked-song" data-value="' + player.id + '">'+ player.title + '</button></li>');
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
    if (channelName != '' && jQuery.inArray(channelName, channelNameCheck) === -1 && trackList.length > 0 ) {
      dataRef.ref().child('channels').push({
        channelName : channelName,
        tracks : trackList
      })
      trackList = [];
      $('#channel-name').val('');
      $('#songName').val('');
      $('.picked-songs').html('<h3>Congrats on your new Gargantuan station!</h3>');
      $('.search-list').html('Hit Search and Then Look Here!');
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

  $('.current-time').css('opacity', '0');
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
    }
    else if ($('.show-button').html() === "Open Player") {
      $('.show-button').html('Close Player');
      // $('.display-buttons').animate({bottom: '20vh'}, 'fast')
    }
  });

  $(".show-channels").on("click", function() {
    if ($('.show-channels').html() === 'Hide Channels'){
      $('.show-channels').html('Show Channels');
      $('.logo').addClass('logo-small');
      $('.channelList').fadeOut('slow');
    }
    else if ($('.show-channels').html() === 'Show Channels') {
      $('.show-channels').html('Hide Channels');
      $('.logo').removeClass('logo-small');
      $('.channelList').fadeIn('slow');

    }
  });

  // Mouse timeout hides content
  var timeout = null;

  $(document).on('mousemove', function() {
    $('.main-body').fadeIn('slow');
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function() {
        $('.main-body').fadeOut('slow');
    }, 4000);
  });


});