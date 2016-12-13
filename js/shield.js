$(document).ready(function(){
	isloggedin();
    getservices();
    getpackages();
    getcontainers();
    if(IsAdmin()){
		$("#menubar").show();
	}
	setInterval(function(){
		getcontainers();
	}, 2500);
});

$("#main_tab").click(function(){
    $("#main_div").show();
    $("#admin_div").hide();
    $("#admin_tab").removeClass('pure-menu-selected');
    $('#main_tab').addClass('pure-menu-selected');
})

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
