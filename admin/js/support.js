var tickets_offset = 0
var admin_offset = 0
$(document).ready(function(){
	isloggedin();
	alltickets();
});

$("#adminloadmore").click(function(){
	if ($("#adminloadmore").hasClass("disabled") == false){
		admin_offset += 1
		alltickets(admin_offset);
	}
});

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
				for (var i = 0; i < data.tickets.length; i++) {
					tr = $('<tr/>');
					tr.append("<td>" + data.tickets[i].id + "</td>");
					tr.append("<td>" + userlink(data.tickets[i].creator)+data.tickets[i].creator+"</a>" + "</td>");
					tr.append("<td>" + link(data.tickets[i].id)+htmlEntities(data.tickets[i].subject)+"</a>" + "</td>");
					tr.append("<td>" + convertTimestamp(data.tickets[i].create_stamp) + "</td>");
					tr.append("<td>" + status(data.tickets[i].status) + "</td>");
					$('#admin_body').append(tr);
				}
				if (data.canloadmore) {
					 $("#adminloadmore").removeClass("disabled")
				}else {
					 $("#adminloadmore").addClass("disabled")
				}
            }
    });
}
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
