$(document).ready(function(){
  getinfo();
});

$("#cd-change").click(function(){
     var req = {containerid: $_GET("id"), hostname: $("#cd-hostname").val()};
     $.ajax({
        type:"POST",
        url: "/api/containers/changedomain",
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
       },
    });
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

$("#delete").click(function(){
swal({
  title: "WARNING! Are you sure you want to delete your website?",
  text: "You will not be able to recover your website!",
  type: "warning",
  showCancelButton: true,
  confirmButtonColor: "#DD6B55",
  confirmButtonText: "Yes, delete it!",
  closeOnConfirm: false
},
function(){
  swal("Deleted!", "Your website has been tasked to be deleted.", "success");
  	  var container = {containerid: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/containers/remove",
            data: JSON.stringify(container),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
                swal("Deleted!", "Your website has been tasked to be deleted.", "success");
                setTimeout(function()
							{
							window.location.assign("/app/dashboard");
							},200);
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
	  }
		});
	});
});

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
