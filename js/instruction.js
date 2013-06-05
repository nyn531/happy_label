$(document).ready(function() {


	$("#how_to").click(function(){
		$("#score_board").stop().hide();
		$("#instruction").fadeIn(100);
	});

	$("#got_it").click(function(){
		console.log("clicked " + this.innerHTML);
		$(".hover_box").fadeOut(100);
	});

	$("#have_it").click(function(){
		console.log("clicked " + this.innerHTML);
		$(".hover_box").fadeOut(100);
	});

	$("#top_score").click(function(){
		$("#instruction").stop().hide();
		$("#score_board").fadeIn(100);
	})


	$(document).mouseup(function (e){
		console.log("test!");
	    var $container = $(".hover_box");
	    var $controller = $(".start_li");
	    if (($container.has(e.target).length === 0)&&($controller.has(e.target).length === 0))
	    {
	        $container.fadeOut(100);
	    }
	});

});