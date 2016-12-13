$(document).ready(function(){
	isloggedin();
	getservices();
	getpackages();
	IsAdmin();
});

$("#torenable").click(function(){
    if (document.getElementById('torenable').checked){
		$("#hostname").attr('disabled', 'disabled');
	}else{
		$("#hostname").removeAttr('disabled');
	}
});

function getservices(){
		   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/services",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					tr = $("<input class='deploy_checkbox' name='SID' value='" + data[i].name + "' id='SID"+data[i].name+"' type='radio'></input>");
					lbl = $("<label for='SID" + data[i].name + "' data-toggle='tooltip' title='" + data[i].description + "'> <span class='deploy_checkbox_icon'><i class='fa " + data[i].icon+ " checkbox_icon' style='font-size: 1em;'></i></span><span class='deploy_checkbox_line1'>" + data[i].name + "</span></span></label>");
					$('#services').append(tr);
					$('#services').append(lbl);
				}
            }
    });
}

function getpackages(){
		   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/packages",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					tr = $("<input class='deploy_checkbox' name='PID' value='" + data[i].id + "' id='PID"+data[i].id+"' type='radio'></input>");
					lbl = $("<label for='PID" + data[i].id + "'> <span class='deploy_checkbox_icon'><i class='fa fa-money package_icon' style='font-size: 1em;'></i></span><span class='deploy_checkbox_line1'>" + data[i].name + ": $"+data[i].price+"/Month</span></span><span class='deploy_checkbox_line2'>"+data[i].ram+"MB RAM "+data[i].diskspace+"GB Disk</span></label>");
					$('#packages').append(tr);
					$('#packages').append(lbl);
				}

            }
    });
}

$("#createservice").click(function(){
	if(!document.getElementById('torenable').checked){
		if (!$("#hostname").val()){
			pagealert("error", "You forgot to enter your domain");
		}
	}

	if (document.querySelector('input[name="SID"]:checked') == null){
		pagealert("error", "You forgot to select a service");
	} else if (document.querySelector('input[name="PID"]:checked') == null){
		pagealert("error", "You forgot to select a package");
	} else{
	 var order = {hostname: $("#hostname").val(), serviceid: document.querySelector('input[name="SID"]:checked').value, packageid: parseInt(document.querySelector('input[name="PID"]:checked').value), torenabled: document.getElementById('torenable').checked};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/containers/new",
            data: JSON.stringify(order),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
							pagealert("success", "Your service has been created");
				    setTimeout(function()
							{
							window.location.assign("/app/dashboard");
							}, 1000);
            },
			 error: function(result) {
					pagealert("error", result.responseText);
				}
		});
	}
});
