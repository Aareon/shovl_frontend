$(document).ready(function(){
	isloggedin();
});


$("#send-email").click(function(){
     var mailreq = {prefix: $("#prefix").val(), recipient: $("#recipient").val(), subject: $("#subject").val(), body: $("#body").val()};
		 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/admin/sendmail",
            data: JSON.stringify(mailreq),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
                pagealert("success", result);
								$("#prefix").val("");
								$("#recipient").val("");
								$("#subject").val("");
								$("#body").val("");
            },
            error: function(result) {
							pagealert("error", result.responseText);
				  }
	});
});
