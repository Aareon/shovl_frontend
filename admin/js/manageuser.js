var llogs_offset = 0
$(document).ready(function(){
  getinfo();
  getloginlog(llogs_offset);
  IsAdmin();
});

//Login load more here
function getloginlog(offset){
	 isloggedin();
	 var req = {email: $_GET("id"), offset: offset};
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
				for (var i = 0; i < data.login_logs.length; i++) {
					tr = $('<tr>');
					tr.append("<td>" + data.login_logs[i].ip + "</td>");
          tr.append("<td>" + convertTimestamp(data.login_logs[i].timestamp) + "</td>");
					tr.append("<td>" + data.manage_logs[i].useragent + "</td>");
					$('#lloglog_table').append(tr);
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

				$("#email").html("Email: "+data.email);
				$("#ip").html("IP Address: "+data.ip);
				$("#registerdate").html("Registered on: "+convertTimestamp(data.register_stamp));
				$("#lastlogin").html("Last Login: "+convertTimestamp(data.login_stamp));
				$("#fullname").html("Full Name: "+data.fullname);
        $("#address").html("Address: "+data.address);
        $("#city").html("City: "+data.city);
        $("#country").html("Country: "+data.country);
        $("#phonenumber").html("Phone Number: "+data.phonenumber);
            },
    });
}
