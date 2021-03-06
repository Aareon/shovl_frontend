$(document).ready(function(){
	isloggedin();
	getinfo();
	setInterval(function(){
		getmetrics();
	}, 1000);
});

var lastgetinfo;
function getinfo(){
	 isloggedin();
         $.ajax({
            type:"GET",
            url: "/api/admin/global-stats",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				if (lastgetinfo != result){
				lastgetinfo = result;
					$("#monthincome").html("<strong><i class='fa fa-money'></i> This months income: </strong>"+credit_text(data.monthincome));
					$("#totalincome").html("<strong><i class='fa fa-money'></i> Total income: </strong>"+credit_text(data.totalincome));
					$("#totalcontainers").html("<strong><i class='fa fa-globe'></i> Containers: </strong>"+data.totalcontainers);
					$("#totalshields").html("<strong><i class='fa fa-shield'></i> Shields: </strong>"+data.totalshields);
					$("#totalusers").html("<strong><i class='fa fa-user'></i> Users: </strong>"+data.totalusers);
					$("#totalattacks").html("<strong><i class='fa fa-area-chart'></i> Attacks: </strong>"+data.totalattacks);
				}
            },
    });
}

function getmetrics(){
	isloggedin();
				$.ajax({
					 type:"GET",
					 url: "/api/admin/stats",
					 beforeSend: function (request)
					 {
							 request.setRequestHeader("Authorization", localStorage.getItem("token"));
					 },
					 success: function(result) {
						 var data = JSON.parse(result);
						 $("#cpu").html("<span>"+data.cpu+"%</span>");
						 $("#cpu").css("width", data.cpu+"%");

						 $("#memory").html("<span>"+data.memory+"% "+data.memoryused+"MB/"+data.memorytotal+"MB"+"</span>");
						 $("#memory").css("width", data.memory+"%");

						 $("#disk").html("<span>"+data.disk+"% "+data.diskused+"GB/"+data.disktotal+"GB"+"</span>");
						 $("#disk").css("width", data.disk+"%");
				 },
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
