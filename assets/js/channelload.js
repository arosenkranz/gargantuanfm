
  var channelId;
  var playlist = [];


  dataRef.ref('channels').on('child_added', function(childSnapshot){
    // console.log(childSnapshot.val());
    $('.channelList').prepend('<div class="small-4 columns"><a class="button large success channelButton" data-channel="' + childSnapshot.key + '">' + childSnapshot.val().channelName + '</a></div>');
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
      
      //pulls selected channel's tracks and pushes streaming urls to an array
        var channel = snapshot.val();
        var tracks = channel['tracks'];

        console.log(channel);
        console.log(tracks);


        for(i = 0; i < tracks.length; i++){
          playlist.push(tracks[i].url);
        }

        console.log(playlist);



      //use soundManager to play tracks
        //soundManager.createSound({
        //id: 'aBassDrum',
        //url: '../mpc/audio/AMB_BD_1.mp3',
      // multiShot: false,
      // when the first sound finishes...
        //onfinish: function() {
      // create and play the second.
      //soundManager.createSound({
        //id: 'aRimSound',
        //url: '../mpc/audio/AMB_RIM1.mp3'
        //}).play();
        //}
        //});
        //soundManager.play('aBassDrum');
      //console.log(snapshot.val());
    })
  }
  

