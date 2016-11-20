var history_offset = 0
$(document).ready(function(){
	isloggedin();
    gethistory(history_offset);
    balance();
    if(IsAdmin()){
		$("#admin_tab").show();
		getgiftcodes();
	}
});

$("#randomcode").click(function(){
    $("#giftcode_admin").val(randomString(32));
})

$("#addfunds").click(function(){
	var giftcode = {"code": $("#giftcode").val()}
	        $.ajax({
            type:"POST",
            url: "/api/account/billing/giftcode",
            data: JSON.stringify(giftcode),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				$("#history_body").html("");
				gethistory();
				balance();
				pagealert("success", "Your account has been credited");
				},
			 error: function(result) {
				pagealert("error", result.responseText);
				}
    });
})

$("#creategiftcode").click(function(){
	var giftcode = {"code": $("#giftcode_admin").val(), "amount": parseFloat($("#amount_admin").val())}
	        $.ajax({
            type:"POST",
            url: "/api/account/billing/giftcode/admin",
            data: JSON.stringify(giftcode),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				$("#giftcode_body").html("");
				getgiftcodes();
				pagelert("success", "Gift code created");
				},
			 error: function(result) {
				pagealert("error", result.responseText);
				}
    });
})

function gethistory(offset){
	 isloggedin();
	 var req = {offset: offset};
         $.ajax({
            type:"POST",
            url: "/api/account/billing/history",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var p;
				for (var i = 0; i < data.bills.length; i++) {
						p = $('<tr>');
						p.append('<td>'+data.bills[i].id+'</td>');
						p.append("<td>"+htmlEntities(data.bills[i].description)+"</td>");
						p.append("<td>"+convertTimestamp(data.bills[i].timestamp)+"</td>");
						p.append("<td>"+credit_text(data.bills[i].amount)+"</td>");
						$('#history_body').append(p);
				}

				if (data.canloadmore) {
					 $("#loadmore").removeClass("disabled")
				}else {
					 $("#loadmore").addClass("disabled")
				}
            }
    });
}

$("#loadmore").click(function(){
	if ($("#loadmore").hasClass("disabled") == false){
		history_offset += 1
		gethistory(history_offset);
	}
});

function getgiftcodes(){
            $.ajax({
            type:"GET",
            url: "/api/account/billing/giftcode/admin",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					tr = $('<tr/>');
					tr.append("<td>" + data[i].code + "</td>");
					tr.append("<td>" + data[i].amount+ "</a>" + "</td>");
					tr.append("<td>" + data[i].usedby+"</a>" + "</td>");
					tr.append("<td>" + status(data[i].status) + "</td>");
					$('#giftcode_body').append(tr);
				}

            }
    });
}

function balance() {
	isloggedin();
    $.ajax({
            type:"GET",
            url: "/api/account/billing/balance",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
			    $("#balance").html(credit_text(parseFloat(result)));
            }
    });
}

function credit_text(amount){
	var response = "";
		if(amount > 0){
			response = '<div class="green">$'+amount.toFixed(2);+'</div>';
		}else{
			response = '<div class="red">$'+amount.toFixed(2);+'</div>';
		}
	return response;
}

function status(code){
	var response;
	if(code == 0){
		response = "<div class='red'>Used</div>";
	}else if(code == 1){
		response = "<div class='green'>Unused</div>";
	}
	return response;
}
