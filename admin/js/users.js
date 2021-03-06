var admin_offset = 0
$(document).ready(function(){
	isloggedin();
	allusers();
});

$("#adminloadmore").click(function(){
	if ($("#adminloadmore").hasClass("disabled") == false){
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
					tr.append("<td>" + userlink(data.profiles[i].email)+data.profiles[i].email+"</a>" + "</td>");
					tr.append("<td>" + GiveDate(data.profiles[i].register_stamp) + "</td>");
					tr.append("<td>" + credit_text(data.profiles[i].credits) + "</td>");
					tr.append("<td>" + rank(data.profiles[i].rank) + "</td>");
					$('#admin_body').append(tr);
				}
				if (data.canloadmore) {
					 $("#adminloadmore").removeClass("disabled")
				}else {
					 $("#adminloadmore").addClass("disabled")
				}
            }
    });
}

function credit_text(amount){
	var response = "";
		if(amount > 0){
			response = '<p class="green">$'+amount.toFixed(2);+'</p>';
		}else{
			response = '<p class="red">$'+amount.toFixed(2);+'</p>';
		}
	return response;
}

function rank(code){
	var response;
	if(code == 0){
		response = "User";
	}else if(code == 1){
		response = "<div class='orange'>Sponsor</div>";
	}else if(code == 3){
		response = "<div class='red'>Admin</div>";
	}else{
		response = "No rank"
		}
	return response;
}
