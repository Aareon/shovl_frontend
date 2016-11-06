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
              if ((data.hostname.split('.').length-1) > 1){
                tr = $('<tr>');
                tr.append("<td>" + "CNAME" +"</td>");
                tr.append("<td>" + data.hostname +"</td>");
                tr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
                $("#dnsrecord_table").append(tr);
              }else{
                firsttr = $('<tr>');
                firsttr.append("<td>" + "CNAME" +"</td>");
                firsttr.append("<td>" + data.hostname +"</td>");
                firsttr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
                $("#dnsrecord_table").append(firsttr);

                secondtr = $('<tr>');
                secondtr.append("<td>" + "CNAME" +"</td>");
                secondtr.append("<td>" + "www." + data.hostname +"</td>");
                secondtr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
                $("#dnsrecord_table").append(secondtr);
              }
            },
    });
}

$("#recheck").click(function(){
    var container = {containerid: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/containers/recheck",
            data: JSON.stringify(container),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
              pagealert("success", result);
              setTimeout(function()
              {
                   window.location.assign("/app/manage?id="+$_GET("id"));
              },1500);
            },
            error: function(result) {
        				pagealert("error", result.responseText);
        	  }
	});
});
