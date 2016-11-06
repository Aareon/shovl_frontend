$(document).ready(function(){
  getinfo();
});

function getinfo(){
    var container = {containerid: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/containers/view",
            data: JSON.stringify(container),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
      				var data = JSON.parse(result);
              $("#domain").html("<strong>"+data.hostname+"</strong>");
              if ((data.hostname.match(/./g)||[]).length > 1){
                tr = $('<tr>');
                tr.append("<td>" + "CNAME" +"</td>");
                tr.append("<td>" + data.hostname +"</td>");
                tr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
                $("#dnsrecord_table").append(tr);
              }else{
                tr = $('<tr>');
                tr.append("<td>" + "CNAME" +"</td>");
                tr.append("<td>" + data.hostname +"</td>");
                tr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
                $("#dnsrecord_table").append(tr);

                tr = $('<tr>');
                tr.append("<td>" + "CNAME" +"</td>");
                tr.append("<td>" + "www." + data.hostname +"</td>");
                tr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
                $("#dnsrecord_table").append(tr);
              }
            },
    });
}

$("#recheck").click(function(){
    var container = {containerid: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/containers/start",
            data: JSON.stringify(container),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				$("#status").html("Status: "+website_status(1));
                SetManageStatus(1);
                pagealert("success", "Website has been tasked to start");
            },
            error: function(result) {
				pagealert("error", result.responseText);
	  }
	});
});
