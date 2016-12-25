var llogs_offset = 0
var billing_offset = 0
var tickets_offset = 0
$(document).ready(function(){
  getinfo();
  getloginlog(llogs_offset);
  gethistory(billing_offset);
  mytickets(tickets_offset)
  getcontainers();
  getshields();
  IsAdmin();
});

//Tickets load more
$("#ticketsloadmore").click(function(){
	if ($("#ticketsloadmore").hasClass("disabled") == false){
		tickets_offset += 1
		mytickets(tickets_offset);
	}
});

function mytickets(offset){
			isloggedin();
			var req = {email: $_GET("email"), offset: offset};
            $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/ticket",
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
					tr.append("<td>" + ticketlink(data.tickets[i].id)+htmlEntities(data.tickets[i].subject)+"</a>" + "</td>");
					tr.append("<td>" + convertTimestamp(data.tickets[i].create_stamp) + "</td>");
					tr.append("<td>" + status(data.tickets[i].status) + "</td>");
					$('#ticket_body').append(tr);
				}
				if (data.canloadmore) {
					 $("#ticketsloadmore").removeClass("disabled")
				}else {
					 $("#ticketsloadmore").addClass("disabled")
				}
            }
    });
}

function ticketlink(id){
		return '<a href="/app/ticket?id='+id+'">';
}

//Billing load more
function gethistory(offset){
	 isloggedin();
	 var req = {email: $_GET("email"), offset: offset};
         $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/billinghistory",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var p;
        if (data != null){
  				for (var i = 0; i < data.bills.length; i++) {
  						p = $('<tr>');
  						p.append('<td>'+data.bills[i].id+'</td>');
  						p.append("<td>"+htmlEntities(data.bills[i].description)+"</td>");
  						p.append("<td>"+convertTimestamp(data.bills[i].timestamp)+"</td>");
  						p.append("<td>"+credit_text(data.bills[i].amount)+"</td>");
  						$('#billing_body').append(p);
  				}
        }

				if (data.canloadmore) {
					 $("#billingloadmore").removeClass("disabled")
				}else {
					 $("#billingloadmore").addClass("disabled")
				}
            }
    });
}

$("#billingloadmore").click(function(){
	if ($("#billingloadmore").hasClass("disabled") == false){
		billing_offset += 1
		gethistory(billing_offset);
	}
});

//Websites load more here
function getcontainers(){
	 isloggedin();
   	 var req = {email: $_GET("email")};
         $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/containers",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var p;
				var allcontainers = $('#service_table').clone().html("");
        if (data != null){
  				for (var i = 0; i < data.length; i++) {
  						tr = $('<tr>');
  						tr.append("<td>" + "<i class='fa " + serviceicon(data[i].serviceid) +  " web_icon'></i>" +"</td>");
  						tr.append("<td>" + weblink(data[i].containerid)+data[i].hostname+"</a>" + "</td>");
  						tr.append("<td>" + packagename(data[i].packageid) + "</td>");
  						tr.append("<td>" + website_status(data[i].status) + "</td>");
  						tr.append("<td>" + "expires: " +GiveDate(data[i].expires_stamp) + "</td>");
  						allcontainers = allcontainers.append(tr);
  				}
        }
				$('#service_table').replaceWith(allcontainers)
            }
    });
}

function weblink(id){
		return '<a href="/app/manage?id='+id+'">';
}

function getshields(){
	 isloggedin();
   	 var req = {email: $_GET("email")};
         $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/containers",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var p;
				var allcontainers = $('#service_table').clone().html("");
        if (data != null){
  				for (var i = 0; i < data.length; i++) {
  						tr = $('<tr>');
  						tr.append("<td>" + "<i class='fa " + serviceicon(data[i].serviceid) +  " web_icon'></i>" +"</td>");
  						tr.append("<td>" + weblink(data[i].containerid)+data[i].hostname+"</a>" + "</td>");
  						tr.append("<td>" + packagename(data[i].packageid) + "</td>");
  						tr.append("<td>" + website_status(data[i].status) + "</td>");
  						tr.append("<td>" + "expires: " +GiveDate(data[i].expires_stamp) + "</td>");
  						allcontainers = allcontainers.append(tr);
  				}
        }
				$('#service_table').replaceWith(allcontainers)
            }
    });
}

function getshields(offset){
		   isloggedin();
		   	var req = {offset: offset};
            $.ajax({
            type: "POST",
            url: "/api/admin/shields",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
							var data = JSON.parse(result);
							var tr;
              var allcontainers = $('#shielde_table').clone().html("");
              if (data != null){
                for (var i = 0; i < data.length; i++) {
                    tr = $('<tr>');
                    tr.append("<td>" + "<i class='fa fa-shield web_icon'></i>" +"</td>");
  									tr.append("<td>" + userlink(data[i].email)+data[i].email+"</a>" + "</td>");
  									tr.append("<td>" + shieldlink(data[i].hostname)+data[i].hostname+"</a>" + "</td>");
  									tr.append("<td>" + data[i].serviceid + "</td>");
  									if (data[i].serviceid == "Free"){
  													tr.append("<td>" + "expires: never" + "</td>");
  									}else{
  													tr.append("<td>" + "expires: " +GiveDate(data[i].expires_stamp) + "</td>");
  									}
                    allcontainers = allcontainers.append(tr);
                }
              }
              $('#shield_table').replaceWith(allcontainers)
            }
    });
}

function shieldlink(id){
		return '<a href="/app/shield-manage?id='+id+'">';
}

//Login load more here
function getloginlog(offset){
	 isloggedin();
	 var req = {email: $_GET("email"), offset: offset};
         $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/loginlogs",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var p;
        if (data != null){
  				for (var i = 0; i < data.login_logs.length; i++) {
  					tr = $('<tr>');
  					tr.append("<td>" + data.login_logs[i].ip + "</td>");
            tr.append("<td>" + convertTimestamp(data.login_logs[i].timestamp) + "</td>");
  					tr.append("<td>" + data.login_logs[i].useragent + "</td>");
  					$('#llog_table').append(tr);
  				}
        }
				if (data.canloadmore) {
					 $("#llog_loadmore").removeClass("disabled")
				}else {
					 $("#llog_loadmore").addClass("disabled")
				}
            }
    });
}

$("#llog_loadmore").click(function(){
	if ($("#llog_loadmore").hasClass("disabled") == false){
		llogs_offset += 1
		getloginlog(llogs_offset);
	}
});

$("#rank-user").click(function(){
     var rank = {email: $_GET("email"), rank: 0};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/rank",
            data: JSON.stringify(rank),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
                pagealert("success", "Rank Changed");
            },
            error: function(result) {
				        pagealert("error", result.responseText);
			}
    });
});

$("#rank-admin").click(function(){
     var rank = {email: $_GET("email"), rank: 3};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/rank",
            data: JSON.stringify(rank),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
                pagealert("success", "Rank Changed");
            },
            error: function(result) {
				        pagealert("error", result.responseText);
			}
    });
});

//Change password
$("#change-password").click(function(){
     var passwordchange = {email: $_GET("email"), password: $("#password").val()};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/password",
            data: JSON.stringify(passwordchange),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
                pagealert("success", "Password Changed");
            },
            error: function(result) {
				        pagealert("error", result.responseText);
			}
    });
});

//Get customer info
function getinfo(){
    var container = {email: $_GET("email")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/admin/usermanage/details",
            data: JSON.stringify(container),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);

				$("#email").html("<strong>Email: </strong>"+data.email);
        $("#rank").html("<strong>Rank: </strong>"+rank(data.rank));
        $("#balance").html("<strong>Balance: </strong>"+credit_text(data.credits));
				$("#ip").html("<strong>IP Address: </strong>"+data.ip);
				$("#registerdate").html("<strong>Registered on: </strong>"+convertTimestamp(data.register_stamp));
				$("#lastlogin").html("<strong>Last Login: </strong>"+convertTimestamp(data.login_stamp));
				$("#fullname").html("<strong>Full Name: </strong>"+data.fullname);
        $("#address").html("<strong>Address: </strong>"+data.address);
        $("#city").html("<strong>City: </strong>"+data.city);
        $("#country").html("<strong>Country: </strong>"+data.country);
        $("#phonenumber").html("<strong>Phone Number: </strong>"+data.phonenumber);
            },
    });
}

function credit_text(amount){
	var response = "";
		if(amount > 0){
			response = '<p class="green">$'+amount.toFixed(2);+'</p>';
		}else{
			response = '<p class="red">$'+amount.toFixed(2);+'</p>';
		}
	return response;
}

function rank(code){
	var response;
	if(code == 0){
		response = "User";
	}else if(code == 1){
		response = "<div class='orange'>Sponsor</div>";
	}else if(code == 3){
		response = "<div class='red'>Admin</div>";
	}else{
		response = "No rank"
		}
	return response;
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
