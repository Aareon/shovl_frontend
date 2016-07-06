$("#reset").click(function(){
     var account = {email: $("#email_field").val()};
     
         $.ajax({
            type:"POST",
            url: "/api/account/forgot",
            data: JSON.stringify(account),
            processData: false,
            success: function(result) {
				$("#error").text("We've sent a password reset link to you");
                setTimeout(function() 
							{
							window.location.assign("/app/login.html");
							}, 2000);  
            },
            error: function(result) {
				$("#error").text(result.responseText);
			}
    });
});

$('#email_field').keypress(function (e) {
 var key = e.which;
 if(key == 13)
  {
    $('#reset').click();
    return false;  
  }
});   
