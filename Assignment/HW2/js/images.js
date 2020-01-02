$(document).ready(function(){
	var x;
	$.ajax({url:"js/data.json",
			dataType:"json",
			success: function(result){
				x = result;
				$.each(result, function(index, element){
					$(".gallery").append("<li><img src='images/square/"+element.path+"' alt='"+element.title+"'/></li>")	
				});
			},
			error: function(){
				alert("error loading file");
			}});

	
	$(".gallery").on("mouseenter", "img", function(e){
		var city;
		var country;
		var taken;
		var path;
		$(this).addClass("gray");
		var alt = $(this).attr("alt");
		$.each(x, function(index, element){
			if(element.title == alt){
				city = element.city;
				country = element.country;
				taken = element.taken;
				path = element.path;
				
			}
		});
		var y = "<div id='preview'><img alt = '"+alt+"' src='images/medium/"+path+"'/><p>"+alt+"<br/>"+city+","+country+" ("+taken+")</p></div>";
		$("body").append(y);
		$("#preview").fadeIn(1000);
		$("#preview").css({
			top: e.pageY + 10,
			left: e.pageX + 10,
			display: "block"
		});
	})

	$(".gallery").on("mousemove", "img", function(e){
		$("#preview").css({
			top: e.pageY+10,
			left: e.pageX+10,
			display: "block"
		});
	})

	$(".gallery").on("mouseleave", "img", function(){
		$(this).removeClass("gray");
		$("#preview").remove();
	})
});
