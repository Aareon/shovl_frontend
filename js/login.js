$("#login").click(function(){
     var account = {email: $("#email_field").val(), password: $("#pass_field").val()};
     
         $.ajax({
            type:"POST",
            url: "/api/account/login",
            data: JSON.stringify(account),
            success: function(result) {
				//Parse JSON, store into localstorage	
				sweetAlert("Well done!", "Login Successful", "success");
                var req = JSON.parse(result);
                localStorage.setItem("token", req.token);
                localStorage.setItem("expires", req.expires);
                localStorage.setItem("refresh_token", req.refresh_token);
                setTimeout(function() 
							{
							window.location.assign("/app/dashboard");
							},800); 
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
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
