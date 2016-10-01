$(document).ready(function(){
    $("#password_div").hide();
    //Load user information in details
   isloggedin();
   IsAdmin();
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
//Tab system for menu
$("#password_tab").click(function(){
    $("#profile_div").hide();
    $("#password_div").show();
    $("#profile_tab").removeClass('pure-menu-selected');
    $('#password_tab').addClass('pure-menu-selected');
})

$("#profile_tab").click(function(){
    $("#password_div").hide();
    $("#profile_div").show();
    $('#password_tab').removeClass('pure-menu-selected');
    $("#profile_tab").addClass('pure-menu-selected');
})
	
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
				sweetAlert("Good job!", "Details updated", "success");
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
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
                sweetAlert("Good job!", "Password Changed", "success");
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
			}
    });
	}else{
		 sweetAlert("Oops...", "Passwords don't match", "error");
	}
});

function password_match(){
	var status = false;
	if($("#newpassword_2").val() == $("#newpassword_1").val()){
		status = true	
	}
	
	return status;
}
