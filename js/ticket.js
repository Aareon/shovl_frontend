var previous;
$(document).ready(function(){
	isloggedin();
	ReloadTicketDiv()
    if(IsAdmin()){
		$("#close").show();
	}
	setInterval(function(){
		ReloadTicketDiv()
	}, 5000);
});
var ticket_head;
//Set ticket header as global variable and place it there in memory
//fetch replies every X second and post all at once instead of appending so you can have seamless refreshing without flicker
function ResetTicketDiv(){
	$("#message").val("");
	 ReloadTicketDiv();
}

function ReloadTicketDiv(){
	getticket();
	getreplies();
}

function getticket(){
     var ticket = {id: parseInt($_GET("id"))};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/account/ticket/view",
            data: JSON.stringify(ticket),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var p;
				if (data.status == 2){
					$("#message").hide();
					$("#reply").hide();
					$("#close").hide();
				}
				p = $('<div class="col-md-12">');
				p.append('<div class="panel panel-primary">'+'<div class="panel-heading"><i class="fa fa-user"></i> '+data.creator+'</div>'+'<div class="panel-body" style="word-wrap:break-word">'+htmlEntities(data.message)+"<br>Sent: "+convertTimestamp(data.create_stamp)+"</div>");
				$('#message_box').html(p);
            },
            error: function(result) {
				window.location.assign("/app/support");
			},
    });
}

function getreplies(){
     var ticket = {id: parseInt($_GET("id"))};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/account/ticket/replies",
            data: JSON.stringify(ticket),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var p;
				var allreplies = $('#reply_box').clone().html("");
				if (data != null){
					for (var i = 0; i < data.length; i++) {
						p = $('<div class="col-md-12">');
						p.append('<div class="panel panel-primary">'+'<div class="panel-heading"><i class="fa fa-user"></i> '+data[i].creator+'</div>'+'<div class="panel-body">'+htmlEntities(data[i].message)+"<br>Sent: "+convertTimestamp(data[i].create_stamp)+"</div>");
						allreplies = allreplies.append(p)
					}
				}
					$('#reply_box').html(allreplies);
            }
    });
}

$("#reply").click(function(){
	 var reply = {id: parseInt($_GET("id")), message: $("#message").val()};
	 isloggedin();
	 if(reply.message.length < 10){
		 pagealert("error", "Your message must be atleast 10 characters long");
	  }else{
         $.ajax({
            type:"POST",
            url: "/api/account/ticket/reply",
            data: JSON.stringify(reply),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				ResetTicketDiv();
					pagealert("success", "Your reply was submitted");
            },
            error: function(result) {
					pagealert("error", result.responseText);
			},
		});
	}
});

$("#close").click(function(){
	 var ticket = {id: parseInt($_GET("id"))};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/account/ticket/close",
            data: JSON.stringify(ticket),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
							ResetTicketDiv();
							pagealert("success", "Ticket has been closed");
            }
		});
});
