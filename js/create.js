$(document).ready(function(){
	isloggedin();
	getservices();
	getpackages();
});

function getservices(){
		   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/services",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					tr = $("<input class='deploy_checkbox' name='SID' value='" + data[i].id + "' id='SID"+data[i].id+"' type='radio'></input>");
					lbl = $("<label for='SID" + data[i].id + "'> <span class='deploy_checkbox_icon'><i class='fa " + serviceicon(data[i].name)+ " checkbox_icon' style='font-size: 1em;'></i></span><span class='deploy_checkbox_line1'>" + data[i].name + "</span></span></label>");
					$('#services').append(tr);
					$('#services').append(lbl);
				}				
            }
    });	
}

function getpackages(){
		   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/packages",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					tr = $("<input class='deploy_checkbox' name='PID' value='" + data[i].id + "' id='PID"+data[i].id+"' type='radio'></input>");
					lbl = $("<label for='PID" + data[i].id + "'> <span class='deploy_checkbox_icon'><i class='fa fa-money package_icon' style='font-size: 1em;'></i></span><span class='deploy_checkbox_line1'>" + data[i].name + ": $"+data[i].price+"/Month</span></span><span class='deploy_checkbox_line2'>"+data[i].ram+"MB RAM "+data[i].diskspace+"GB Disk</span></label>");
					$('#packages').append(tr);
					$('#packages').append(lbl);
				}
				
            }
    });	
}

function serviceicon(name){
	var icon;
	if (name == "Wordpress"){
			icon = "fa-wordpress";
	}else if (name == "Joomla"){
			icon = "fa-joomla";
	}else if( name == "Owncloud"){
			icon = "fa-cloud";
	}else{
		icon = "fa-question";
	}	
	return icon;
}
/*
For create 
if (document.getElementById('r1').checked) {
  rate_value = document.getElementById('r1').value;
}*/

$("#createservice").click(function(){	
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
