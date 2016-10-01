var tickets_offset = 0
var admin_offset = 0
$(document).ready(function(){
	isloggedin();
    $("#ticket_div").hide();
	mytickets();
});

$("#loadmore").click(function(){
	if ($("#loadmore").hasClass("pure-button-disabled") == false){		
		tickets_offset += 1
		mytickets(tickets_offset);
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
				for (var i = 0; i < data.tickets.length; i++) {
					tr = $('<tr/>');
					tr.append("<td>" + data.tickets[i].id + "</td>");
					tr.append("<td>" + link(data.tickets[i].id)+htmlEntities(data.tickets[i].subject)+"</a>" + "</td>");
					tr.append("<td>" + convertTimestamp(data.tickets[i].create_stamp) + "</td>");
					tr.append("<td>" + status(data.tickets[i].status) + "</td>");
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
