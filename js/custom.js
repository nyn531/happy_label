var top_prefix = "tree";
var image_num = 3;
var iambusy = 0;
var my_id = 0; 
var partner_id = 0;
var game_id = 0;
var image_id = 0;
var playerRef = new Firebase('https://nyn531.firebaseIO.com/player');
var playerIDRef = new Firebase('https://nyn531.firebaseIO.com/player_id');
var playerCountRef = new Firebase('https://nyn531.firebaseIO.com/player_count');
var gameRef = new Firebase('https://nyn531.firebaseIO.com/game');
var gameCountRef = new Firebase('https://nyn531.firebaseIO.com/game_count');
var imageRef = new Firebase('https://nyn531.firebaseIO.com/img');
var image_fb = 'https://nyn531.firebaseIO.com/img/';
var tree_fb = 'https://nyn531.firebaseIO.com/';
var game_fb = 'https://nyn531.firebaseIO.com/game/';
var image_prefix = "data/";
var image_affix = ".jpg";

// both sides call
$(document).ready(function() {
	//register player to database
	playerIDRef.transaction(function(current_value) {
		my_id = current_value + 1; //generate my player id
		if (my_id == 1) playerRef.child(my_id).set('1');
		playerRef.child(my_id).set({game_id:0}); //add myself to player list
		// handle id=1 bug case 
		if (my_id !=1) {
			playerRef.child(my_id).on('value', function(snapshot) { // game starts
				if (snapshot.val().game_id >1) {
					game_id = snapshot.val().game_id;
					partner_id = snapshot.val().partner_id;
					init();
				}
			});
	  }
		return my_id;
	});

	//increase player count
	playerCountRef.transaction(function(current_value) {
		update_value = current_value + 1; 
		playerRef.child(my_id).onDisconnect().remove();
	  return update_value;
	});

	//player count real time update
	playerCountRef.on('value', function(snapshot) {
		$("#player_count").text(snapshot.val()); 
	});

	//player real time update (this is necessary even doing no operation)
	playerRef.on('child_changed', function(snapshot) { 

	});

});

// both sides call 
function init() {
	alert("Hey, Player "+ my_id +" Game Start!");

	gameRef.child(game_id).child('correct_count').on('value', function(snapshot) {
		$("#matches").text(snapshot.val()); 
	});

	//sync for wrong match, both sides call
	gameRef.child(game_id).child('image_id').on('value', function(snapshot) {
		//alert('mismatched!');
		$("#status").text('mismatch, hurry up!'); 
		gameRef.child(game_id).child("prefix").set(top_prefix);
		image_id = snapshot.val();
		set_image();
		generate_options();
	});

	//sync for correct match, both sides call
	gameRef.child(game_id).child("correct_count").on('value', function(snapshot) {
		//alert('matched!');
		$("#status").text('match, good job!'); 
		generate_options();
	});

}

// find partner and game setup, single side call
function find_partner() {
	playerRef.once('value', function(snapshot) {
	  snapshot.forEach(function(childSnapshot) {
	   		//find a player with game status 0
	   		if (childSnapshot.val().game_id == 0 && 
	   				iambusy == 0 &&
	   				childSnapshot.name() != my_id &&
	   				childSnapshot.name() != 1) 
	   		{
	   			partner_id = childSnapshot.name(); 
	   			playerRef.child(partner_id).set('1'); //change player status 
	   			playerRef.child(my_id).set('1');			//change player status 
	   			iambusy = 1;
	   			gameCountRef.transaction(function(current_game_id) {
	   				if (current_game_id != 0) {
							game_id = current_game_id + 1; 		//generate my game id
							gameRef.child(game_id).set('0');
							gameRef.child(game_id).child("choice_num").set(0);
							gameRef.child(game_id).child("correct_count").set(0);
							gameRef.child(game_id).child("prefix").set(top_prefix);
							gameRef.child(game_id).child(my_id).set(0);
							gameRef.child(game_id).child(partner_id).set(0);
							gameRef.child(game_id).onDisconnect().remove();
							playerRef.child(partner_id).set({game_id:game_id, partner_id:my_id}); //change player status 
	   					playerRef.child(my_id).set({game_id:game_id, partner_id:partner_id});			//change player status 
	   					image_id = gen_rand_image();
	   					gameRef.child(game_id).child('image_id').set(image_id);
	   					return game_id;
						}
					});
	   			return;
	   		} 
  	});
  	if (partner_id==0) {
			alert("Sorry, there is no player available. Pleas try again later!");
		}
	});
} 

function set_image() {
	$("#candidate").attr('src', image_prefix+image_id.toString()+image_affix);
}

function gen_rand_image() {
	var rand_id = Math.floor((Math.random()*image_num)+1);
	while (rand_id == image_id) {
		rand_id = Math.floor((Math.random()*image_num)+1);
	}
	return rand_id;
}

function generate_options() {
	//var dataRef = new Firebase(image_fb + image_id);
	$("#choice").text("");
	gameRef.child(game_id).child('prefix').once('value', function(snapshot) {
		var optionRef = new Firebase(tree_fb + snapshot.val());
		optionRef.once('value', function(snapshot) {
			var all = snapshot.child("all").val();
			if (all == 0 || all == null) {
				handle_mismatch();
				return;
			}
			all = all.split(",");
			var container = $("#option_container");
			container.empty();
			for (i=0; i<all.length; i++) {
				container.append('<td><a onclick="on_option_selected();" option='+all[i]+' class="btn btn-large btn-success" href="#">'+ all[i] + '</a></td>');
			}
		});
	});

	gameRef.child(game_id).child(my_id).on('value', function(snapshot) {
		if (snapshot.val()==1) {
			gameRef.child(game_id).child(my_id).set(0);
		} 
	});
}

// response to chosen option, single side call
function on_option_selected() {
	var choice = event.toElement.getAttribute("option");
	$("#choice").text(choice); 
	var tmpGameRef = new Firebase(game_fb + game_id);
	tmpGameRef.child(my_id).set(choice);

	gameRef.child(game_id).child("choice_num").transaction(function(current_value) {
  	return current_value + 1;
	});

	gameRef.child(game_id).once('value', function(snapshot) {
  	if (snapshot.child("choice_num").val() == 2) {
  		var my_choice = snapshot.child(my_id).val();
			var partner_choice = snapshot.child(partner_id).val();
  		if (my_choice == partner_choice) {
  			handle_match(my_choice);
  		} else {
  			handle_mismatch();
  		}
  		gameRef.child(game_id).child("choice_num").set(0);
  	}
	});
}

function handle_mismatch() {
	//generate a new image and upate image_id on server
	image_id = gen_rand_image();
	alert('new image!');
	gameRef.child(game_id).child("image_id").set(image_id);
}

function handle_match(my_choice) {
	//update prefix on server
	var new_prefix = update_prefix(my_choice);
	//update score on server 
	update_score(new_prefix);
	//update correct_count on server 
	gameRef.child(game_id).child("correct_count").transaction(function(current_value) {
		return current_value + 1;
	});
}

/* actions after match */
function update_prefix(my_choice) {
	var new_prefix = "";
	gameRef.child(game_id).child('prefix').transaction(function(current_value) {
		new_prefix = current_value;
		if (current_value.indexOf(my_choice) == -1) {
			new_prefix = current_value + '/' + my_choice;
		}
		return new_prefix;
	});
	return new_prefix;
}

function update_score(new_prefix) {
	var dataRef = new Firebase(image_fb + image_id + '/history/' + new_prefix);
	dataRef.child('score').transaction(function(current_value) {
		return current_value + 1;
	});
}

