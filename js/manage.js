var logs_offset = 0
$(document).ready(function(){
  getinfo();
  getmanagelog(logs_offset);
  getdbinfo();
  IsAdmin();
});

$("#manage_tab").click(function(){
  $("#logs_div").hide();
  $("#database_div").hide();
  $("#files_div").hide();
  $("#manage_div").show();
  $('#database_tab').removeClass('pure-menu-selected');
  $('#logs_tab').removeClass('pure-menu-selected');
  $("#files_tab").removeClass('pure-menu-selected');
  $("#manage_tab").addClass('pure-menu-selected');
})

$("#logs_tab").click(function(){
    $("#manage_div").hide();
    $("#database_div").hide();
    $("#files_div").hide();
    $("#logs_div").show();
    $('#database_tab').removeClass('pure-menu-selected');
    $('#manage_tab').removeClass('pure-menu-selected');
    $("#files_tab").removeClass('pure-menu-selected');
    $("#logs_tab").addClass('pure-menu-selected');
})

$("#database_tab").click(function(){
    $("#manage_div").hide();
    $("#logs_div").hide();
    $("#files_div").hide();
    $("#database_div").show();
    $('#manage_tab').removeClass('pure-menu-selected');
    $("#logs_tab").removeClass('pure-menu-selected');
    $("#files_tab").removeClass('pure-menu-selected');
    $("#database_tab").addClass('pure-menu-selected');
})

$("#files_tab").click(function(){
    $("#manage_div").hide();
    $("#logs_div").hide();
    $("#database_div").hide();
    $("#files_div").show();
    $('#manage_tab').removeClass('pure-menu-selected');
    $("#logs_tab").removeClass('pure-menu-selected');
    $("#database_tab").removeClass('pure-menu-selected');
    $("#files_tab").addClass('pure-menu-selected');
})
"files_tab"
function getmanagelog(offset){
	 isloggedin();
	 var req = {containerid: $_GET("id"), offset: offset};
         $.ajax({
            type:"POST",
            url: "/api/containers/managelogs",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {	
				var data = JSON.parse(result);
				var p;
				for (var i = 0; i < data.manage_logs.length; i++) {
					if (data.manage_logs[i].serviceid != 0){
					tr = $('<tr>');
					tr.append("<td>" + data.manage_logs[i].action + "</td>");
					tr.append("<td>" + convertTimestamp(data.manage_logs[i].timestamp) + "</td>");
					$('#managelog_table').append(tr);
					}
				}
				
				if (data.canloadmore) {
					 $("#loadmore").removeClass("pure-button-disabled")
				}else {
					 $("#loadmore").addClass("pure-button-disabled")
				}
            }
    });	
}

$("#loadmore").click(function(){
	if ($("#loadmore").hasClass("pure-button-disabled") == false){	
		logs_offset += 1
		getmanagelog(logs_offset);
	}
});

function getdbinfo(){
	 isloggedin();
         $.ajax({
            type:"GET",
            url: "/api/account/database",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				$("#db_hostname").html("Domain: "+data.hostname);
				$("#db_username").html("Username: "+data.username);
				$("#db_password").html("Password: "+data.password);
            },
    });
}

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
				if(data.serviceid == "Custom"){
						$("#files_tab").show();
				}
				$("#hostname").html("Domain: "+data.hostname);
				$("#service").html("Service: "+"<i class='fa " + serviceicon(data.serviceid) +  "'></i> "+data.serviceid);
				$("#status").html("Status: "+website_status(data.status));
				$("#package").html("Package: "+packagename(data.packageid));
				$("#expires").html("Due date: "+GiveDate(data.expires_stamp));
            },
    });
}

$("#start").click(function(){
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
				$("#status").html("Status: "+website_status(1))
                sweetAlert("Well done!", "Website has been tasked to start", "success");
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
	  }
	});
});

$("#stop").click(function(){
    var container = {containerid: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/containers/stop",
            data: JSON.stringify(container),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				$("#status").html("Status: "+website_status(0))
                sweetAlert("Well done!", "Website has been tasked to stop", "success");
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
	  }
	});
});

$("#restart").click(function(){
    var container = {containerid: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/containers/restart",
            data: JSON.stringify(container),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
                sweetAlert("Well done!", "Website Restarted", "success");
            },
            error: function(result) {
				sweetAlert("Oops...", result.responseText, "error");
	  }
	});
});

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

function serviceiconfromid(id){
	return serviceicon(localStorage.getItem("service_" + id));
}

function packagename(id){
	return localStorage.getItem("package_"+id)
}

$("#dbupload").submit(function(e){
isloggedin();
e.preventDefault();

    var formdata = new FormData(this);

        $.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener("progress", function(evt) {
					if (evt.lengthComputable) {
						var percentComplete = (evt.loaded / evt.total) * 100;						
						if (percentComplete == 100){
							$("#db_progress").hide();
							$("#db_progressbar").css("width", "0%")
						}else{
							$("#db_progress").show();
							$("#db_progressbar").css("width", percentComplete+"%")
						}
					}
			   }, false);
			   return xhr;
			},
            url: "/api/account/database/import",
            type: "POST",
            data: formdata,
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            mimeTypes:"multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function(){
                sweetAlert("Database uploaded!", "Starting import", "success");
            },error: function(result){
                sweetAlert("Oops!", result.responseText, "error");
            }
         });
      });

$("#webrootupload").submit(function(e){
isloggedin();
e.preventDefault();

    var formdata = new FormData(this);
    formdata.set("containerid", $_GET("id"));

        $.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener("progress", function(evt) {
					if (evt.lengthComputable) {
						var percentComplete = (evt.loaded / evt.total) * 100;						
						if (percentComplete == 100){
							$("#webroot_progress").hide();
							$("#webroot_progressbar").css("width", "0%")
						}else{
							$("#webroot_progress").show();
							$("#webroot_progressbar").css("width", percentComplete+"%")
						}
					}
			   }, false);
			   return xhr;
			},
            url: "/api/containers/webroot/upload",
            type: "POST",
            data: formdata,
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            mimeTypes:"multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function(){
                sweetAlert("Website uploaded!", "Starting import", "success");
            },error: function(result){
                sweetAlert("Oops!", result.responseText, "error");
            }
         });
      });

function SetManageStatus(){
	
}
