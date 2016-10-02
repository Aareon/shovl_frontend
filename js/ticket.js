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
				p = $('<p>');
				p.append('<p class="thick"><i class="fa fa-user"></i> '+data.creator+':</p>');
				p.append("<p>"+htmlEntities(data.message)+"</p>");
				p.append("<p>Sent: "+convertTimestamp(data.create_stamp)+"</p>");
				p.append('<div class="line-separator"></div>');
				ticket_head = p;
            },
            error: function(result) {
				window.location.assign("/app/support");
			},
			async: false,
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
				var allreplies = ticket_head;
				if (data != null){
					for (var i = 0; i < data.length; i++) {
						p = $('<p>');
						p.append('<p class="thick"><i class="fa fa-user"></i> '+data[i].creator+':</p>');
						p.append("<p>"+htmlEntities(data[i].message)+"</p>");
						p.append("<p>"+"Sent: " + convertTimestamp(data[i].create_stamp)+"</p>");
						p.append('<div class="line-separator"></div>');
						allreplies = allreplies.append(p)
					}
				}
				$('#message_box').html(allreplies);
				window.scrollTo(0,document.body.scrollHeight);
            }
    });	
}

$("#reply").click(function(){	
	 var reply = {id: parseInt($_GET("id")), message: $("#message").val()};
	 isloggedin();
	 if(reply.message.length < 10){
		sweetAlert("Oops...", "Your message must be atleast 10 characters long", "error");	
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
				sweetAlert("Well done!", "Your reply was submitted", "success");				
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
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
				sweetAlert("Well done!", "Ticket has been closed", "success");				
            }
		});	
});
