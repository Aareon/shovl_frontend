var admin_offset = 0
$(document).ready(function(){
		isloggedin();
    getservices();
    getpackages();
    getcontainers();
});

$("#adminloadmore").click(function(){
	if ($("#adminloadmore").hasClass("disabled") == false){
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
				pagealert("success", "Package has been created");
            },
            error: function(result) {
				pagealert("error", result.responseText);
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
					if (data.containers[i].serviceid != "SQL"){
						tr = $('<tr/>');
						tr.append("<td>" + userlink(data.containers[i].email)+data.containers[i].email+"</a>" + "</td>");
						tr.append("<td>" + "<i class='fa " + serviceicon(data.containers[i].serviceid) +  " web_icon'></i>" +"</td>");
						tr.append("<td>" + link(data.containers[i].containerid)+data.containers[i].hostname+"</a>" + "</td>");
						tr.append("<td>" + packagename(data.containers[i].packageid) + "</td>");
						tr.append("<td>" + website_status(data.containers[i].status) + "</td>");
						$('#service_table').append(tr);
					}else{
						tr = $('<tr/>');
						tr.append("<td>" + userlink(data.containers[i].email)+data.containers[i].email+"</a>" + "</td>");
						tr.append("<td>" + "<i class='fa fa-database web_icon'></i>" +"</td>");
						tr.append("<td>" + "</td>");
						tr.append("<td>" + "SQL") + "</td>");
						tr.append("<td>" + website_status(data.containers[i].status) + "</td>");
						$('#service_table').append(tr);
					}
				}
				if (data.canloadmore) {
					 $("#adminloadmore").removeClass("disabled")
				}else {
					 $("#adminloadmore").addClass("disabled")
				}
            }
    });
}

function link(id){
		return '<a href="/app/manage?id='+id+'">';
}
