$(document).ready(function() {

    var channelId;
    var counter = 0;
    var playlist = [];
    var artists = [];
    var trackNumber;
    var playlistName;
    var audio = document.querySelector('audio');
    var scUserId;
    var scPlaylistArr = [];
    var scPlaylist = function(name, tracks) {
        this.name = name;
        this.tracks = tracks;
    }

    $(document).on('click', '.sc-auth', function() {
        // initiate auth popup
        SC.connect().then(function() {
            return SC.get('/me');
        }).then(function(me) {
            console.log(me)
            loadSCPlaylists(me.id);
        });
    });

    function loadSCPlaylists(id) {
        SC.get('/users/' + id + '/playlists').then(function(playlists) {
            for (var i = 0; i < playlists.length; i++) {
                var playlist = new scPlaylist(playlists[i].name, playlists[i].tracks);
                scPlaylistArr.push(playlist);
                console.log(scPlaylistArr);
            }
        });
    }


    dataRef.ref('channels').on('child_added', function(childSnapshot) {
        // console.log(childSnapshot.val());
        $('.channelList').prepend('<div class="column column-block channelButton" data-equalizer-watch data-channel="' + childSnapshot.key + '">' + childSnapshot.val().channelName + '</div>');
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // When a channel is clicked, 
    $(document).on('click', '.channelButton', function() {
        $('.current-time').css('opacity', '1');
        $('.channelList').fadeOut('slow');
        $('.show-channels').html('Show Channels');
        $('.show-button').html('Close Player');
        $('.logo').addClass('logo-small');
        $('.track-player').addClass('is-open');
        channelId = $(this).data('channel').trim();
        playlistName = "";
        artists = [];
        playlist = [];
        trackNumber = 0;
        console.log(trackNumber);
        console.log(channelId);
        loadChannel();

    });

    function playTracks() {
        audio.currentTime = 0;
        var trackUrl = playlist[trackNumber];
        var songInfo = artists[trackNumber];
        $('.song-info').html(songInfo);
        $('.playlist-info').html('NOW PLAYING<br/>' + playlistName);
        $(document).prop('title', playlistName + ' // Gargantuan.FM')
        $('#play-pause').removeClass('fi-play').addClass('fi-pause');
        if (trackNumber < playlist.length) {

            $('audio').attr("src", trackUrl + "?client_id=8761e61199b55df39ee27a92f2771aeb");
            setTimeout(function() {
                if ($('audio').get(0).paused) {
                    $('audio').get(0).play();
                }
            }, 150);

            console.log("Track Number: " + trackNumber);

            $('audio').get(0).onended = function() {
                nextSong();
            }
        } else {
            replay();
        }
    };

    audio.addEventListener('error', nextSong);

    //function to play previous song
    function prevSong() {
        if (trackNumber > 0) {
            trackNumber--;
            setTimeout(playTracks, 150);
        } else {
            replay();
        }
    };

    //replays playlist
    function replay() {
        $('audio').get(0).pause();
        trackNumber = 0;
        playTracks();
    };

    //plays previous track when prevButton clicked
    $(document).on('click', '#prevButton', function() {
        $('audio').get(0).pause();
        $('audio').get(0).currentTime = 0;
        prevSong();
    });

    //plays next track when skipButton clicked
    $(document).on('click', '#skipButton', function() {
        $('audio').get(0).pause();
        $('audio').get(0).currentTime = 0;
        nextSong();
    });

    //function to play next song
    function nextSong() {
        trackNumber++;
        playTracks();
    };

    $(document).keyup(function(e) {
        console.log(e);
        if (e.keyCode === 39) {
            nextSong();
        }
        if (e.keyCode === 37) {
            prevSong();
        }
    })

    // Pulls the selected channel's info and passes it into our audio element 
    function loadChannel() {
        dataRef.ref('channels/' + channelId).once('value').then(function(snapshot) {
            playlistName = snapshot.val().channelName;
            //pulls selected channel's tracks 
            var channel = snapshot.val();
            var tracks = channel['tracks'];

            //pushes streaming urls into an array
            for (var i = 0; i < tracks.length; i++) {
                artists.push(tracks[i].artist + ' - ' + tracks[i].trackName);
                playlist.push(tracks[i].url);
            };

            //use html5 audio to play tracks
            playTracks();
        })
    };
});