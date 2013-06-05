var gamelink = "http://stanford.edu/~zhengs/happy_label/index.html";
function get_param(){
	var prmstr = window.location.search.substr(1);
	var prmarr = prmstr.split ("&");
	var params = {};

	for ( var i = 0; i < prmarr.length; i++) {
	    var tmparr = prmarr[i].split("=");
	    params[tmparr[0]] = tmparr[1];
	}
	return params;
}

function showResult() {
	var params = get_param();
	my_name = params['my_name'];
	partner_name = params['partner_name'];
	matches = params['matches'];
	scores = params['scores'];
	$("#my_name").text(my_name);
	$("#partner_name").text(partner_name);
	$("#matches").text(matches);
	$("#scores").text(scores);
}

$(document).ready(function() {
	showResult();
	$("#play_again").click(function(){
		top.window.location = gamelink;
	});
	$("#check_leader").click(function(){
		top.window.location = gamelink;
	});
});