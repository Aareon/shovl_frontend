var tickets_offset = 0
$(document).ready(function(){
	isloggedin();
	mytickets();
});

$("#loadmore").click(function(){
	if ($("#loadmore").hasClass("disabled") == false){
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
					 $("#loadmore").removeClass("disabled")
				}else {
					 $("#loadmore").addClass("disabled")
				}
            }
    });
}

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
                pagealert("success", "Ticket Created");
                $("#subject").val("");
                $("#message").val("");
                setTimeout(function()
							{
							window.location.reload();
							}, 1000);
            },
            error: function(result) {
				pagealert("error", result.responseText);
	  }
	});
});

function link(id){
		return '<a href="/app/ticket?id='+id+'">';
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
