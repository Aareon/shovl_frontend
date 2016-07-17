$("#reset").click(function(){
     var account = {email: $("#email_field").val()};
     
         $.ajax({
            type:"POST",
            url: "/api/account/forgot",
            data: JSON.stringify(account),
            processData: false,
            success: function(result) {
				sweetAlert("Well done!", "We've sent a password reset link to you", "success");
                setTimeout(function() 
							{
							window.location.assign("/app/login");
							}, 2000);  
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
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
