$(document).ready(function(){
    $("#history_div").hide();
    gethistory();
    balance();
});


$("#credit_tab").click(function(){
    $("#credit_div").show();
    $("#history_div").hide();
    $("#history_tab").removeClass('pure-menu-selected');
    $('#credit_tab').addClass('pure-menu-selected');
})

$("#history_tab").click(function(){
    $("#credit_div").hide();
    $("#history_div").show();
    $('#credit_tab').removeClass('pure-menu-selected');
    $("#history_tab").addClass('pure-menu-selected');
})


function gethistory(){
	 isloggedin();
         $.ajax({
            type:"GET",
            url: "/api/account/billing/history",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {	
				var data = JSON.parse(result);
				var p;
				for (var i = 0; i < data.length; i++) {
					p = $('<tr>');
					p.append('<td>'+data[i].id+'</td>');
					p.append("<td>"+htmlEntities(data[i].description)+"</td>");
					p.append("<td>"+convertTimestamp(data[i].timestamp)+"</td>");
					p.append("<td>"+credit_text(data[i].amount)+"</td>");
					$('#history_body').append(p);
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
			response = '<h3 class="green">$'+amount.toFixed(2);+'</h3>';
		}else{
			response = '<h3 class="red">$'+amount.toFixed(2);+'</h3>';
		}
	return response;
}
