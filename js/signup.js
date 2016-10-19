$("#signup").click(function(){
     var account = {email: $("#email_field").val(), password: $("#pass_field").val(), referral: localStorage.getItem("referredby")};

         $.ajax({
            type:"POST",
            url: "/api/account/new",
            data: JSON.stringify(account),
            processData: false,
            success: function(result) {
                pagealert("success", "Account created");
                setTimeout(function()
							{
							window.location.assign("/app/login");
							}, 1000);
            },
            error: function(result) {
				        pagealert("error", result.responseText);
			}
    });
});

$('#pass_field').keypress(function (e) {
 var key = e.which;
 if(key == 13)
  {
    $('#signup').click();
    return false;
  }
});
