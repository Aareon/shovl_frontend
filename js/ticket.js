$(document).ready(function(){
	isloggedin();
	getticket();
    getreplies();
});

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
					$("#close").hide();
					$("#reply").hide();
				}
				p = $('<p>');
				p.append('<p class="thick"><i class="fa fa-user"></i> '+data.creator+':</p>');
				p.append("<p>"+htmlEntities(data.message)+"</p>");
				p.append("<p>Sent: "+convertTimestamp(data.create_stamp)+"</p>");
				p.append('<div class="line-separator"></div>');
				$('#message_box').append(p);
            },
            error: function(result) {
				window.location.assign("/app/support.html");
			}
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
				for (var i = 0; i < data.length; i++) {
					p = $('<p>');
					p.append('<p class="thick"><i class="fa fa-user"></i> '+data[i].creator+':</p>');
					p.append("<p>"+htmlEntities(data[i].message)+"</p>");
					p.append("<p>"+convertTimestamp(data[i].create_stamp)+"</p>");
					p.append('<div class="line-separator"></div>');
					$('#message_box').append(p);
				}
            }
    });	
}

$("#reply").click(function(){	
	 var reply = {id: parseInt($_GET("id")), message: $("#message").val()};
	 isloggedin();
	 if(reply.message.length < 20){
		sweetAlert("Oops...", "Your message must be atleast 20 characters long", "error");	
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
				$("#message").val("");
				$("#message_box").html("");
				getticket();
				getreplies();
				sweetAlert("Well done!", "Your reply was submitted", "success");				
            }
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
				$("#message").val("");
				$("#message_box").html("");
				getticket();
				getreplies();
				sweetAlert("Well done!", "Ticket has been closed", "success");				
            }
		});	
});
