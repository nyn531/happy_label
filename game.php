<!DOCTYPE html> 

<?php 

if (!empty($_GET["workerId"]) && !(empty($_GET["assignmentID"]))){
     //if this webpage was passed these two variables, the worker has accepted the HIT
     //store them in the session for when we submit later
     $_SESSION['workerId'] = $_GET['workerId'];
     $_SESSION['assignmentId']= $_GET['assignmentId'];
     $_SESSION['submitURL']= $_GET['turkSubmitTo'];

//make the start button appear, but you’ll need to comment this out until you’re finished programming and ready for sandbox testing.

//echo ‘ /*html to make your start button*/’;
}

?>

<html>

<head>
	<meta charset="utf-8">
	<title>HappyLabel</title> 
	
<!-- 	<link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" /> -->
	<link rel="stylesheet" type="text/css" href="style_3.css" />

	<script type='text/javascript' src='https://cdn.firebase.com/v0/firebase.js'></script>
	<script src="js/jquery-1.9.1.min.js"></script>
	<script src="js/bootstrap.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/custom.js"></script>
	<script src="js/check_browser_close.js"></script>

</head> 

<body>
<div class="header">
	<div class="title wrapper">
		<div class="logo">
			Happy Label
		</div>
		<div class="operation">
			<button class="button btn-s" onclick="find_partner()">Start a new game</button>
		</div>
	</div>
</div>
<div class="wrapper">
<!-- 	<div class="row clearfix">
		<div class="welcome">
			<h1>Welcome to Happy Label</h1>
			<h4>There are <span id="player_count"></span> people playing.</h4>
			<button class="button" onclick="find_partner()"> Start a new game </button>
		</div>
		<div class="info">
			<div class="status"><h4>Congratulations! You two both agreed on this!</h4></div>
		</div>
	</div> -->
	<div class="row clearfix">
		<div class="avatar" id="partner_id">
			<div class="head">
				<img src="img/head.jpg"></img>
				<h4>guest<span id="my_id"></span></h4>
			</div>
		</div>
		<div class="scoreboard clearfix">
			<div class="time">
				<h4>Time left: <span id="timer">0</span> second</h4> 
			</div>
			<div>
				<div class="score"><h5>This guess worths</h5><h2><span id="factor">0</span></h2></div>
				<div class="score"><h5>Total credits earned</h5><h2><span id="scores">0</span></h2></div>
				<div class="score"><h5>Total matches</h5><h2><span id="matches">0</span></h2></div>
			</div>

<!-- 			<h4>#matches: <span id="matches"></span><br>current choice: <span id="choice"></span><br>previous round: <span id="status"></span></h4> -->
		</div>
		<div class="avatar" id="you_id">
			<div class="head">
				<img src="img/head.jpg"></img>
				<h4>guest<span id="opponent_id"></span></h4>
			</div>
		</div>		
	</div>
	<div class="row"><div class="status"><h4 id="status">Welcome to Happy Label!</h4></div></div>
	<div class="row"><div class="guess"><h3>What is in the image?</h3></div></div>
	<div class="row clearfix">
		<div class="action" id="partner_ac">
			<div class="think"><h4 id="mode">Still thinking...</h4></div>
		</div>
		<div class="playground">
			<img id="candidate" class="canvas" src="data/0.jpg" height="450" width="450">
		</div>
		<div class="action" id="you_ac">
			<ul><li><h4>Your Choice: &nbsp;<span id="choice"></span></h4></li></ul>
			<ul id ="option_container">
				<!--
				<li><a class="option" href="#">Ford</a></li>
				<li><a class="option" href="#">Toyota</a></li>
				<li><a class="option" href="#">option_3</a></li>
				<li><a class="option" href="#">option_4</a></li>
				<li><a class="option" href="#">option_5</a></li>
				<li><a class="option" href="#">option_6</a></li>
				<li><a class="option" href="#">option_7</a></li>
			-->
			</ul>
		</div>
	</div>
</div>



<!-- <div class="wrapper">
<h1> Welcome to Happy Label </h1>
<h3>There are <span id="player_count"></span> people playing.</h3>
<h3>#matches: <span id="matches"></span><br>current choice: <span id="choice"></span><br>previous round: <span id="status"></span></h4>

<div class="center">
	<button class="btn btn-large btn-success" onclick="find_partner()"> Start a new game </button>
</div>
<br>
<img id="candidate" class="canvas" src="data/cat.jpg" height="400" width="400">
<h3>What is in the image?</h3>
<br>
<div class="wrapper">
	<table>
		<tr id="option_container">
		</tr>
	</table>
</div>
</div> -->

<form id ="mturk_form" method ="POST" action = "<?php echo urldecode($_SESSION['submitURL']).'/mturk/externalSubmit'; ?>"

<input type="hidden" id="assignmentId" name="assignmentId" value="<?php echo $_SESSION['assignmentId'] ?>" />

<input type="hidden" id="workerId" name="assignmentId" value="<?php echo $_SESSION['workerId'] ?>" />

<!-- any other data you want to send to MT send in a similar way, using hidden form fields. These appear on your requester interface on the MT website for when you approve/reject responses. I usually send the time taken, to reject those who did it too quickly etc.-->

<input id="submitButton" type="submit" name="Submit" value="Submit to MTurk"/>

</form>

</body>
