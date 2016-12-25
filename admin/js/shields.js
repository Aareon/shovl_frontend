var admin_offset = 0
$(document).ready(function(){
		isloggedin();
    getshields();
});

$("#adminloadmore").click(function(){
	if ($("#adminloadmore").hasClass("disabled") == false){
		admin_offset += 1
		getshields(admin_offset);
	}
});

function getshields(offset){
		   isloggedin();
		   	var req = {offset: offset};
            $.ajax({
            type: "POST",
            url: "/api/admin/shields",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
							var data = JSON.parse(result);
							var tr;
							for (var i = 0; i < data.shields.length; i++) {
									tr = $('<tr/>');
									tr.append("<td>" + "<i class='fa fa-shield web_icon'></i>" +"</td>");
									tr.append("<td>" + userlink(data.shields[i].email)+data.shields[i].email+"</a>" + "</td>");
									tr.append("<td>" + link(data.shields[i].hostname)+data.shields[i].hostname+"</a>" + "</td>");
									tr.append("<td>" + data.shields[i].serviceid + "</td>");
									if (data.shields[i].serviceid == "Free"){
													tr.append("<td>" + "expires: never" + "</td>");
									}else{
													tr.append("<td>" + "expires: " +GiveDate(data.shields[i].expires_stamp) + "</td>");
									}
									$('#service_table').append(tr);
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
		return '<a href="/app/shield-manage?id='+id+'">';
}
