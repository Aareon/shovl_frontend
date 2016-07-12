$(document).ready(function(){
	isloggedin();
    $("#menubar").hide();
    $("#admin_div").hide();
    if(IsAdmin()){
		$("#menubar").show();	
	}
});

$("#main_tab").click(function(){
    $("#main_div").show();
    $("#admin_div").hide();
    $("#admin_tab").removeClass('pure-menu-selected');
    $('#main_tab').addClass('pure-menu-selected');
})

$("#admin_tab").click(function(){
    $("#main_div").hide();
    $("#admin_div").show();
    $('#main_tab').removeClass('pure-menu-selected');
    $("#admin_tab").addClass('pure-menu-selected');
})

$("#newwebsite").click(function(){	
	window.location.assign("/app/create.html");
});


$("#createpackage").click(function(){	
	 var package = {name: $("#package_name").val(), price: parseFloat($("#package_amount").val()), ram: parseInt($("#package_ram").val()), diskspace: parseInt($("#package_disk").val())};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/packages/new",
            data: JSON.stringify(package),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {	
				sweetAlert("Well done!", "Package has been created", "success");				
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");	
	  }
		});	
});

$("#createservice").click(function(){	
	 var package = {name: $("#service_name").val()};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/services/new",
            data: JSON.stringify(package),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {	
				sweetAlert("Well done!", "Service has been created", "success");				
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");	
	  }
		});	
});
