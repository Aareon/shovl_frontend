$("#login").click(function(){
     var account = {email: $("#email_field").val(), password: $("#pass_field").val()};
     
         $.ajax({
            type:"POST",
            url: "/api/account/login",
            data: JSON.stringify(account),
            success: function(result) {
				//Parse JSON, store into localstorage		
                $("#error").text("Login Successful");
                var req = JSON.parse(result);
                localStorage.setItem("token", req.token);
                localStorage.setItem("expires", req.expires);
                localStorage.setItem("refresh_token", req.refresh_token);
            },
            error: function(result) {
				$("#error").text(result.responseText);
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

//if time.now > stamped time
