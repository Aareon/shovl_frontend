$(document).ready(function(){
	isloggedin();
	getservices();
});

function getservices(){
		   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/shield/services/list",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					tr = $("<input class='deploy_checkbox' name='SID' value='" + data[i].name + "' id='SID"+data[i].name+"' type='radio'></input>");
					lbl = $("<label for='SID" + data[i].name + "'> <span class='deploy_checkbox_icon'><i class='fa fa-money package_icon' style='font-size: 1em;'></i></span><span class='deploy_checkbox_line1'>" + data[i].name + ": $"+data[i].price+"/Month</span></span></label>");
					$('#services').append(tr);
					$('#services').append(lbl);
				}

            }
    });
}

$("#createservice").click(function(){
		if (!$("#hostname").val()){
			pagealert("error", "You forgot to enter your domain");
		}
		if (!$("#host").val()){
			pagealert("error", "You forgot to enter your origin server");
		}
		if (!$("#port").val()){
			pagealert("error", "You forgot to enter your port");
		}

	if (document.querySelector('input[name="SID"]:checked') == null){
		pagealert("error", "You forgot to select a service");
	} else{
	 var order = {hostname: $("#hostname").val(), serviceid: document.querySelector('input[name="SID"]:checked').value, host: $("#host").val(), port: $("#port").val()};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/shield/order",
            data: JSON.stringify(order),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
							pagealert("success", result);
				    setTimeout(function()
							{
							window.location.assign("/app/shield");
							}, 1000);
            },
			 error: function(result) {
					pagealert("error", result.responseText);
				}
		});
	}
});
