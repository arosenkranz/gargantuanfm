
  var channelId;

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

  // ALISA, work with this to pull the selected channel's info and pass it into our audio element pahlease 
  function loadChannel() {
    dataRef.ref('channels/' + channelId).once('value').then(function(snapshot){
      console.log(snapshot.val());
    })
  }
  

