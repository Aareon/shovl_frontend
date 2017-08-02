$(document).ready(function(){
    //Load user information in details
   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/account/details",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
                var req = JSON.parse(result);
                $("#fullname").val(req.fullname);
                $("#address").val(req.address);
                $("#phonenumber").val(req.phonenumber);
                $("#city").val(req.city);
                $("#country").val(req.country);
            }
    });
});

$("#update-profile").click(function(){
     var details = {fullname: $("#fullname").val(), phonenumber: $("#phonenumber").val(), address: $("#address").val(), city: $("#city").val(), country: $("#country").val()};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/account/details",
            data: JSON.stringify(details),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				pagealert("success", "Details updated");
            },
            error: function(result) {
				pagealert("error", result.responseText);
			}
    });
});

$("#change-password").click(function(){
     var passwordchange = {password: $("#password").val(), passwordnew: $("#newpassword_1").val()};
	 isloggedin();
	 if(password_match()){
         $.ajax({
            type:"POST",
            url: "/api/account/password",
            data: JSON.stringify(passwordchange),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				$("#password").val("")
				$("#newpassword_1").val("")
				$("#newpassword_2").val("")
                pagealert("success", "Password Changed");
            },
            error: function(result) {
				pagealert("error", result.responseText);
			}
    });
	}else{
		 pagealert("error", "Passwords don't match");
	}
});

function password_match(){
	var status = false;
	if($("#newpassword_2").val() == $("#newpassword_1").val()){
		status = true
	}

	return status;
}
