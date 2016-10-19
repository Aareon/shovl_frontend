$("#login").click(function(){
     var account = {email: $("#email_field").val(), password: $("#pass_field").val()};

         $.ajax({
            type:"POST",
            url: "/api/account/login",
            data: JSON.stringify(account),
            success: function(result) {
				//Parse JSON, store into localstorage
                var req = JSON.parse(result);
                localStorage.setItem("token", req.token);
                localStorage.setItem("expires", req.expires);
                localStorage.setItem("refresh_token", req.refresh_token);
                setTimeout(function()
							{
							var lastlink = localStorage.getItem("lastlink")
								if (lastlink === null) {
									 window.location.assign("/app/dashboard");
								}else{
									localStorage.removeItem("lastlink");
									window.location.assign(lastlink);
								}
							},800);
            },
            error: function(result) {
				if (result.responseText == "Please confirm your email to login"){
					swal({
					  title: "Oops...",
					  text: "You haven't confirmed your email yet, please confirm your account before logging in",
					  type: "error",
					  showCancelButton: true,
					  confirmButtonText: "Resend email",
					  cancelButtonText: "Close",
					  closeOnConfirm: false
					},
					function(){
					  swal("Well Done!", result.responseText, "success");

					       var account = {email: $("#email_field").val()};

							 $.ajax({
								type:"POST",
								url: "/api/resendconfirm",
								data: JSON.stringify(account),
								processData: false,
								success: function(result) {
									sweetAlert("Well done!", "We have resent the confirmation email, you can't find it, check your spam folder.", "success");
								},
								error: function(result) {
									sweetAlert("Oops...", result.responseText, "error");
								},
						});

					});
				} else {
					pagealert("Oops...", result.responseText, "error");
				}
			}
    });
});

$('#pass_field').keypress(function (e) {
 var key = e.which;
 if(key == 13)
  {
    $('#login').click();
    return false;
  }
});
