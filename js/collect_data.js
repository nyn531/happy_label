var gameRef = new Firebase('https://nyn531.firebaseIO.com/game');
var imageRef = new Firebase('https://nyn531.firebaseIO.com/img');
var playerRef = new Firebase('https://nyn531.firebaseIO.com/player');

function showPlayerData() {
	playerRef.once('value', function(snapshot) {
	  var container = $("#player_container");
		container.empty();
		container.append('<li>id 		game_id	 	game_num		partner_id		partner_name</li>');
  	snapshot.forEach(function(childSnapshot) {
			container.append('<li>'+childSnapshot.name()+"		"+
				childSnapshot.val().game_id+"	 	"+
				childSnapshot.val().game_num+"		"+
				childSnapshot.val().partner_id+"		"+
				childSnapshot.val().partner_name+'</li>');
  	});
  });
}

function showGameData() {
	gameRef.once('value', function(snapshot) {
	  var container = $("#game_container");
		container.empty();
		container.append('<li>game_id 		image_id	 	#correct		#wrong</li>');
  	snapshot.forEach(function(childSnapshot) {
			container.append('<li>'+childSnapshot.name()+"		"+
				childSnapshot.val().image_id+"	 	"+
				childSnapshot.val().correct_count+"		"+
				childSnapshot.val().wrong_count+'</li>');
  	});
  });
}

function showImgData() {
	imageRef.once('value', function(snapshot) {
	  var container = $("#img_container");
		//container.empty();
		//container.append('<li>game_id 		image_id	 	#correct		#wrong</li>');
  	snapshot.forEach(function(childSnapshot) {
  		console.log(childSnapshot.val());
  	});
  });
}
