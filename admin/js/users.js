var admin_offset = 0
$(document).ready(function(){
	isloggedin();
	allusers();			
});

$("#adminloadmore").click(function(){
	if ($("#adminloadmore").hasClass("pure-button-disabled") == false){		
		admin_offset += 1
		allusers(admin_offset);
	}
});

function allusers(offset){
		   isloggedin();
		   	var req = {offset: offset};
            $.ajax({
            type: "POST",
            url: "/api/admin/users",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.profiles.length; i++) {
					tr = $('<tr/>');
					tr.append("<td>" + link(data.profiles[i].email)+data.profiles[i].email+"</a>" + "</td>");
					tr.append("<td>" + data.profiles[i].country+"</a>" + "</td>");
					tr.append("<td>" + data.profiles[i].balance + "</td>");
					tr.append("<td>" + data.profiles[i].rank + "</td>");
					$('#admin_body').append(tr);
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
		return '<a href="manageuser?email='+id+'">';
}

function rank(code){
	var response;
	if(code == 0){
		response = "<div class='green'>User</div>";	
	}else if(code == 1){
		response = "<div class='orange'>Sponsor</div>";	
	}else if(code == 5){
		response = "<div class='red'>Admin</div>";	
	}
	return response;
}
