function UpdateBackend(){
		   isloggedin();
            $.ajax({
            type: "GET",
            url: "/api/admin/update",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				          pagealert("success", result);
            },
            error: function(result) {
                  pagealert("error", result.responseText);
            },
    });
}

function UpdateCDN(){
		   isloggedin();
            $.ajax({
            type: "GET",
            url: "/api/admin/cdnupdate",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				          pagealert("success", result);
            },
            error: function(result) {
                  pagealert("error", result.responseText);
            },
    });
}
