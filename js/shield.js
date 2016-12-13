$(document).ready(function(){
    getshields();
    if(IsAdmin()){
		$("#menubar").show();
	}
	setInterval(function(){
		getshields();
	}, 2500);
});

$("#newshield").click(function(){
	window.location.assign("/app/new-shield");
});


function getshields(){
	 isloggedin();
         $.ajax({
            type:"GET",
            url: "/api/shield/list",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var p;
				var allcontainers = $('#service_table').clone().html("");
				for (var i = 0; i < data.length; i++) {
						tr = $('<tr>');
						tr.append("<td>" + "<i class='fa fa-shield web_icon'></i>" +"</td>");
						tr.append("<td>" + link(data[i].hostname)+data[i].hostname+"</a>" + "</td>");
						tr.append("<td>" + data[i].serviceid + "</td>");
						tr.append("<td>" + "expires: " +GiveDate(data[i].expires_stamp) + "</td>");
						allcontainers = allcontainers.append(tr);
					}
				$('#service_table').replaceWith(allcontainers)
          }
    });
}

function link(id){
		return '<a href="shield-manage?id='+id+'">';
}
