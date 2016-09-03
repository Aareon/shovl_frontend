var tickets_offset = 0
var admin_offset = 0
$(document).ready(function(){
	isloggedin();
    $("#ticket_div").hide();
    $("#admin_div").hide();
    $("#admin_tab").hide();
	mytickets();
	if(IsAdmin()){
		alltickets();	
		$("#admin_tab").show();			
	}
});

$("#loadmore").click(function(){
	if ($("#loadmore").hasClass("pure-button-disabled") == false){		
		tickets_offset += 1
		mytickets(tickets_offset);
	}
});

$("#adminloadmore").click(function(){
	if ($("#adminloadmore").hasClass("pure-button-disabled") == false){		
		admin_offset += 1
		alltickets(admin_offset);
	}
});

function mytickets(offset){
			isloggedin();
			var req = {offset: offset};
            $.ajax({
            type:"POST",
            url: "/api/account/ticket",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					tr = $('<tr/>');
					tr.append("<td>" + data[i].id + "</td>");
					tr.append("<td>" + link(data[i].id)+htmlEntities(data[i].subject)+"</a>" + "</td>");
					tr.append("<td>" + convertTimestamp(data[i].create_stamp) + "</td>");
					tr.append("<td>" + status(data[i].status) + "</td>");
					$('#ticket_body').append(tr);
				}
				if (data.canloadmore) {
					 $("#loadmore").removeClass("pure-button-disabled")
				}else {
					 $("#loadmore").addClass("pure-button-disabled")
				}
            }
    });	
}

function alltickets(offset){
		   isloggedin();
		   	var req = {offset: offset};
            $.ajax({
            type: "POST",
            url: "/api/account/ticket/admin",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					tr = $('<tr/>');
					tr.append("<td>" + data[i].id + "</td>");
					tr.append("<td>" + data[i].creator+"</a>" + "</td>");
					tr.append("<td>" + link(data[i].id)+htmlEntities(data[i].subject)+"</a>" + "</td>");
					tr.append("<td>" + convertTimestamp(data[i].create_stamp) + "</td>");
					tr.append("<td>" + status(data[i].status) + "</td>");
					$('#admin_body').append(tr);
				}
				if (data.canloadmore) {
					 $("#adminloadmore").removeClass("pure-button-disabled")
				}else {
					 $("#adminloadmore").addClass("pure-button-disabled")
				}
            }
    });	
}

//Tab system for menu
$("#create_tab").click(function(){
    $("#create_div").show();
    $("#ticket_div").hide();
    $("#admin_div").hide();
    $("#ticket_tab").removeClass('pure-menu-selected');
    $('#admin_tab').removeClass('pure-menu-selected');
    $('#create_tab').addClass('pure-menu-selected');
})

$("#ticket_tab").click(function(){
    $("#create_div").hide();
    $("#admin_div").hide();
    $("#ticket_div").show();
    $('#create_tab').removeClass('pure-menu-selected');
    $('#admin_tab').removeClass('pure-menu-selected');
    $("#ticket_tab").addClass('pure-menu-selected');
})

$("#admin_tab").click(function(){
    $("#create_div").hide();
    $("#admin_div").show();
    $("#ticket_div").hide();
    $('#create_tab').removeClass('pure-menu-selected');
    $('#ticket_tab').removeClass('pure-menu-selected');
    $("#admin_tab").addClass('pure-menu-selected');
})

$("#create-ticket").click(function(){
     var ticket = {subject: $("#subject").val(), message: $("#message").val()};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/account/ticket/new",
            data: JSON.stringify(ticket),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {	
                sweetAlert("Well done!", "Ticket Created", "success");
                $("#subject").val("");
                $("#message").val("");
                setTimeout(function() 
							{
							window.location.reload();
							}, 1000);  
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");	
	  }
	});
});

function link(id){
		return '<a href="ticket?id='+id+'">';
}

function status(code){
	var response;
	if(code == 0){
		response = "<div class='orange'>Awaiting Reply</div>";	
	}else if(code == 1){
		response = "<div class='green'>Replied</div>";	
	}else if(code == 2){
		response = "<div class='red'>Closed</div>";	
	}
	return response;
}
