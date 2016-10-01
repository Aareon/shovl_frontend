var admin_offset = 0
$(document).ready(function(){
	isloggedin();
    $("#menubar").hide();
    $("#admin_div").hide();
    getservices();
    getpackages();
    getcontainers();
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

$("#adminloadmore").click(function(){
	if ($("#adminloadmore").hasClass("pure-button-disabled") == false){		
		admin_offset += 1
		getcontainers(admin_offset);
	}
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

function getcontainers(offset){
		   isloggedin();
		   	var req = {offset: offset};
            $.ajax({
            type: "POST",
            url: "/api/admin/containers",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.containers.length; i++) {
					if (data[i].serviceid != "SQL"){
					tr = $('<tr/>');
					tr.append("<td>" + data[i].Email + "</td>");
					tr.append("<td>" + "<i class='fa " + serviceicon(data[i].serviceid) +  " web_icon'></i>" +"</td>");
					tr.append("<td>" + link(data[i].containerid)+data[i].hostname+"</a>" + "</td>");
					tr.append("<td>" + packagename(data[i].packageid) + "</td>");
					tr.append("<td>" + website_status(data[i].status) + "</td>");
					$('#service_table').append(tr);
					}
				}
				if (data.canloadmore) {
					 $("#adminloadmore").removeClass("pure-button-disabled")
				}else {
					 $("#adminloadmore").addClass("pure-button-disabled")
				}
            }
    });	
}

function link(id){
		return '<a href="manage?id='+id+'">';
}
