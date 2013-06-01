var top_prefix = "tree2/Vehicle";
var image_num = 129;
var secs = 200;
//var timer_on = 0;
var iambusy = 0;
var my_id = 0; 
var partner_id = 0;
var game_id = 0;
var image_id = 0;
var myInterval = null;
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
	if (game_id == null) return;

	start_timer();

	gameRef.child(game_id).onDisconnect().remove();
	$("#my_id").text(my_id); 
	$("#opponent_id").text(partner_id); 
	alert("Game Start!");
	/*
		gameRef.child(game_id).child("timer").on('value', function(snapshot) {
			if (snapshot.val() == 0) {
				alert("Time is up! Thanks for playing!");
				$("#timer").text("0"); 
				end_game();
			} else {
				$("#timer").text(snapshot.val()); 
			}
		});
	*/

	//sync for correct match, both sides call
	gameRef.child(game_id).child('score_factor').on('value', function(snapshot) {
		$("#factor").text(snapshot.val()*20); 
	});

	//sync for correct match, both sides call
	gameRef.child(game_id).child('correct_count').on('value', function(snapshot) {
		$("#matches").text(snapshot.val());  
		$("#status").text('Congratulations! You two both agreed on this!'); 
		var cur_worth = $("#factor").text();
		var cur_score = $("#scores").text();
		var new_score = parseInt(cur_score, 10) + parseInt(cur_worth, 10);
		$("#scores").text(new_score.toString()); 
		//alert("Match!");
		//alert("generate options!");
		generate_options();
	});

	gameRef.child(game_id).child('wrong_count').on('value', function(snapshot) {
		$("#status").text('Sorry! Your partner disagreed with you!'); 
	});
	//sync for wrong match, both sides call
	gameRef.child(game_id).child('image_id').on('value', function(snapshot) {
		$("#status").text('Congratulations! You two both agreed on this!'); 
		gameRef.child(game_id).child("prefix").set(top_prefix);
		image_id = snapshot.val();
		set_image();
 		//alert("Mismatch!");
		generate_options();
	});

	playerRef.on('child_removed', function(snapshot) {
		if(snapshot.name() == partner_id) {
			end_game();
		}
	});
}

function end_game(){
	alert("Game is over!");
	/*
	var buttons = document.getElementsByClassName('btn btn-large btn-success');
	buttons[0].disabled=false;
	buttons[0].onclick = find_partner();
	*/
	
	//gameRef.child(game_id).remove();
	playerRef.child(my_id).child('game_id').set(0);	
	playerRef.child(my_id).child('partner_id').remove();	
	$("#timer").text(0);
	$("#matches").text(0); 
	$("#candidate").attr('src', "data/0.jpg");
	$("#status").text("Thanks for playing!");
	window.clearInterval(myInterval);
	top.window.location = "http://stanford.edu/~nayinan/cgi-bin/esp/#";
}


function start_timer() {
	/*
	var buttons = document.getElementsByClassName('btn btn-large btn-success');
	buttons[0].disabled=true;
	*/
	$("#timer").text(secs.toString()); 
	myInterval = setInterval(function(){
		time = $("#timer").text(); 
		time_int = parseInt(time, '10')-1;
		if (time_int == 0) end_game();
		$("#timer").text(time_int.toString()); 
	},1000);
//sync for correct match, both sides call
/*
	gameRef.child(game_id).child("timer").once('value', function(snapshot) {
		if (snapshot.val()==secs) {
			myInterval = setInterval(function(){
				gameRef.child(game_id).child("timer").transaction(function(current_value) {
				  return current_value - 1; 
				});
			},1000);
		}
	});
*/
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
							gameRef.child(game_id).child("wrong_count").set(0);
							gameRef.child(game_id).child("score_factor").set(1);
							//gameRef.child(game_id).child("timer").set(secs);
							gameRef.child(game_id).child("prefix").set(top_prefix);
							gameRef.child(game_id).child(my_id).set(0);
							gameRef.child(game_id).child(partner_id).set(0);
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
			alert("Sorry, there is no player available. Please try again later!");
		}
	});
} 

function set_image() {
	if (image_id==null) image_id =0;
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
	$("#mode").text("Please make your choice!");
	gameRef.child(game_id).child('prefix').once('value', function(snapshot) {
		var optionRef = new Firebase(tree_fb + snapshot.val());
		optionRef.once('value', function(snapshot) {
			var all = snapshot.child("all").val();
			console.log(all);
			if (all == 0 || all == null) {
				handle_end_image();
				return;
			}
			all = all.split(",");
			var container = $("#option_container");
			container.empty();
			shuffle(all);
			for (i=0; i<all.length; i++) {
				container.append('<li><a class="option" onclick="on_option_selected();" option='+all[i]+' href="#">'+all[i]+'</a></li>');
				//container.append('<tr><td><button id="btn'+i+'" onclick="on_option_selected();" option='+all[i]+' class="btn btn-large btn-success" href="#">'+ all[i] + '</button></td></tr>');
			}
		});
	});

	gameRef.child(game_id).child(my_id).on('value', function(snapshot) {
		if (snapshot.val()==1) {
			gameRef.child(game_id).child(my_id).set(0);
		} 
	});
}

function shuffle ( myArray ) {
  var i = myArray.length, j, temp;
  if ( i === 0 ) return false;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = myArray[i];
     myArray[i] = myArray[j]; 
     myArray[j] = temp;
   }
}

// response to chosen option, single side call
function on_option_selected() {
	var choice = event.toElement.getAttribute("option");
	$("#choice").text(choice); 
	$("#mode").text("Your partner is still thinking...");
	var tmpGameRef = new Firebase(game_fb + game_id);
	tmpGameRef.child(my_id).set(choice);

	var buttons = document.getElementsByClassName('option');
	for (i=0;i<buttons.length;i++) {
		buttons[i].onclick = "";
	}

	gameRef.child(game_id).child("choice_num").transaction(function(current_value) {
  	return current_value + 1;
  	//return current_value+my_id;
	});

	setTimeout(function (){
		gameRef.child(game_id).once('value', function(snapshot) {
			console.log(snapshot.child("choice_num").val());
	  	if (snapshot.child("choice_num").val() == 2) {
	  		var my_choice = snapshot.child(my_id).val();
				var partner_choice = snapshot.child(partner_id).val();
				console.log(my_choice + " "+partner_choice);
	  		if (my_choice == partner_choice) {
	  			handle_match(my_choice);
	  		} else {
	  			handle_mismatch();
	  		}
	  		gameRef.child(game_id).child("choice_num").set(0);
	  	}
		});
  }, 500);	
}

function handle_end_image() {
	//generate a new image and upate image_id on server
	image_id = gen_rand_image();
	//alert('new image!');
	gameRef.child(game_id).child("score_factor").set(1);
	gameRef.child(game_id).child("image_id").set(image_id);
}

function handle_mismatch() {
	//generate a new image and upate image_id on server
	image_id = gen_rand_image();
	//alert('new image!');
	gameRef.child(game_id).child("score_factor").set(1);
	gameRef.child(game_id).child("image_id").set(image_id);
	gameRef.child(game_id).child("wrong_count").transaction(function(current_value) {
		return current_value + 1;
	});
}

function handle_match(my_choice) {
	//update prefix on server
	var new_prefix = update_prefix(my_choice);
	//update score on server 
	update_score(new_prefix);
	setTimeout(function (){
		gameRef.child(game_id).child("correct_count").transaction(function(current_value) {
			return current_value + 1;
		});

		gameRef.child(game_id).child("score_factor").transaction(function(current_value) {
			return current_value + 1;
		});
	}, 500);	
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
