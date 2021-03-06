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

$("#newwebsite").click(function(){
	window.location.assign("/app/create");
});

var lastgetcontainers;
function getcontainers(){
	 isloggedin();
         $.ajax({
            type:"GET",
            url: "/api/containers",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				if (result != lastgetcontainers){
					lastgetcontainers = result;
					var p;
					var allcontainers = $('#service_table').clone().html("");
					for (var i = 0; i < data.length; i++) {
						if (data[i].serviceid != "SQL"){
							tr = $('<tr>');
							tr.append("<td>" + "<i class='fa " + serviceicon(data[i].serviceid) +  " web_icon'></i>" +"</td>");
							tr.append("<td>" + link(data[i].containerid)+data[i].hostname+"</a>" + "</td>");
							tr.append("<td>" + packagename(data[i].packageid) + "</td>");
							tr.append("<td>" + website_status(data[i].status) + "</td>");
							tr.append("<td>" + "expires: " +GiveDate(data[i].expires_stamp) + "</td>");
							allcontainers = allcontainers.append(tr);
						}else{
							tr = $('<tr>');
							tr.append("<td>" + "<i class='fa fa-database web_icon'></i>" +"</td>");
							tr.append("<td>" + sql_link(data[i].containerid)+"MariaDB Container</a>" + "</td>");
							tr.append("<td>" + "SQL" + "</td>");
							tr.append("<td>" + website_status(data[i].status) + "</td>");
							tr.append("<td>" + "expires: never" + "</td>");
							allcontainers = allcontainers.append(tr);
						}
					}
					$('#service_table').replaceWith(allcontainers)
            }
					}
    });
}

function sql_link(id){
		return '<a href="sql-manage?id='+id+'">';
}

function link(id){
		return '<a href="manage?id='+id+'">';
}
