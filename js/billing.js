var history_offset = 0
$(document).ready(function(){
	isloggedin();
    gethistory(history_offset);
    balance();
});

$("#randomcode").click(function(){
    $("#giftcode_admin").val(randomString(32));
})

$("#card-deposit").click(function(){
	var req = {"amount": parseInt($("#card-amount").val()), "year": parseInt($("#card-year").val()), "month": parseInt($("#card-month").val()), "number": $("#card-number").val(), "cvc": $("#card-cvc").val(), "name": $("#card-name").val()}
	        $.ajax({
            type:"POST",
            url: "/api/stripe/deposit",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
					pagealert("success", result);
			},
			 error: function(result) {
				pagealert("error", result.responseText);
			}
    });
})

$("#btc-deposit").click(function(){
	var req = {"amount": parseFloat($("#btc-amount").val())}
	        $.ajax({
            type:"POST",
            url: "/api/btc/deposit",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				$("#btc-amount").attr('disabled', 'disabled');
				$("#btc-div").html(result);
				},
			 error: function(result) {
				pagealert("error", result.responseText);
			}
    });
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
