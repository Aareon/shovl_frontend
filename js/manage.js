var logs_offset = 0
//File Manager global vars
var currentdir = "/";
var currentpackage = 0;
var currentstatus = 0;
$(document).ready(function(){
  getinfo();
  getmanagelog(logs_offset);
  getdbinfo();
  IsAdmin();
  FM_DisplayCurrentDir(currentdir);
  getpackages();
  getfirewallrules();
  $('tr').click(function(event) {
    if (event.target.type !== 'checkbox') {
      $(':checkbox', this).trigger('click');
    }
  });
  setInterval(function(){
    getinfo();
  }, 2500);
});

function reloadfirewallrules(){
  $("#firewall-table").html("");
  getfirewallrules();
}

function getfirewallrules(){
	 isloggedin();
   var req = {containerid: $_GET("id")};
         $.ajax({
            type:"POST",
            url: "/api/containers/firewall/list",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
    				var data = JSON.parse(result);
    				var p;
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                      if (data[i].block == false) {
                        tr = $('<tr>');
                        tr.append("<td>" + "<div class='green'>Accept</div>" +"</td>");
                        tr.append("<td>" + data[i].ipcidr + "</td>");
                        tr.append(`<td><button class='btn btn-danger' type='button' onclick='DeleteFirewallRule("`+data[i].ipcidr+`")'>Delete</button></td>`);
                        $("#firewall-table").append(tr)
                      }
                }
                for (var i = 0; i < data.length; i++) {
                      if (data[i].block == true) {
                        tr = $('<tr>');
                        tr.append("<td>" + "<div class='red'>Block</div>" +"</td>");
                        tr.append("<td>" + data[i].ipcidr + "</td>");
                        tr.append(`<td><button class='btn btn-danger' type='button' onclick='DeleteFirewallRule("`+data[i].ipcidr+`")'>Delete</button></td>`);
                        $("#firewall-table").append(tr)
                      }
                }
              }
            },
    });
}

function DeleteFirewallRule(ipcidr){
        var container = {containerid: $_GET("id"), ipcidr: ipcidr};
        isloggedin();
        $.ajax({
          type:"POST",
          url: "/api/containers/firewall/delete",
          data: JSON.stringify(container),
          beforeSend: function (request)
          {
              request.setRequestHeader("Authorization", localStorage.getItem("token"));
          },
          success: function(result) {
              pagealert("success", result);
              reloadfirewallrules();
          },
          error: function(result) {
              pagealert("error", result.responseText);
          },
      });
}

$("#show-password").click(function(){
    $("#db_password").show();
    $(this).hide();
    $("#hide-password").show();
})

$("#hide-password").click(function(){
    $("#db_password").hide();
    $(this).hide();
    $("#show-password").show();
})

$("#fr-create").click(function(){
    var type = false;
    if ($("#fr-type").val() == "Block") {
      type = true;
    }
     var req = {containerid: $_GET("id"), ipcidr: $("#fr-ipcidr").val(), block: type};
     $.ajax({
        type:"POST",
        url: "/api/containers/firewall/new",
        data: JSON.stringify(req),
        beforeSend: function (request)
        {
            request.setRequestHeader("Authorization", localStorage.getItem("token"));
        },
        success: function(result) {
          pagealert("success", result);
          reloadfirewallrules();
       },
        error: function(result) {
          pagealert("error", result.responseText);
       },
    });
});

$("#renew").click(function(){
    var container = {containerid: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/containers/renew",
            data: JSON.stringify(container),
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

$('#https-box').click(function() {
	var ischecked = false
	if ($(this).is(':checked')){
		ischecked = true
	}
	var req = {containerid: $_GET("id"), enabled: ischecked};
        $.ajax({
           type:"POST",
           url: "/api/containers/https/setting",
           data: JSON.stringify(req),
           beforeSend: function (request)
           {
               request.setRequestHeader("Authorization", localStorage.getItem("token"));
           },
           success: function(result) {
			   pagealert("success", result)
			},
		   error: function(result) {
			   pagealert("error", result.responseText)
			},
   });
});

$('#fm-move').click(function() {
		  swal({
			title: "Move File/Folder",
			text: "Enter the path to where you wish you move it:",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: true,
			animation: "slide-from-top",
			inputPlaceholder: "Path"
		  },
		  function(inputValue){
			if (inputValue === false) return false;

			if (inputValue === "") {
			  swal.showInputError("Your path can't be blank");
			  return false
			}

        $("input[name='checkrowbox']:checked").each(function () {
          FM_Rename(currentdir+$(this).val(), currentdir+inputValue);
        });
        pagealert("success", "Moved selected elements.");
        FM_DisplayCurrentDir(currentdir);
		});
});

$("#fm-delete").click(function(){
    swal({
      title: "WARNING! Are you sure you want to delete the selected elements?",
      text: "You will not be able to recover these files",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true
    },
    function(){
        $("input[name='checkrowbox']:checked").each(function () {
          FM_Delete(currentdir+$(this).val());
        });
        pagealert("success", "Deleted selected elements.")
        FM_DisplayCurrentDir(currentdir);
    	});
    });

function FM_Delete(dir){
  isloggedin();
  var req = {containerid: $_GET("id"), file: dir};
        $.ajax({
           type:"POST",
           url: "/api/containers/filemanager/delete",
           data: JSON.stringify(req),
           beforeSend: function (request)
           {
               request.setRequestHeader("Authorization", localStorage.getItem("token"));
           },
   });
}

$('#fm-refresh').click(function() {
  FM_DisplayCurrentDir(currentdir);
});

$('#fm-mkdir').click(function() {
  swal({
    title: "Create a Folder",
    text: "Name your new folder:",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: true,
    animation: "slide-from-top",
    inputPlaceholder: "New Folder name"
  },
  function(inputValue){
    if (inputValue === false) return false;

    if (inputValue === "") {
      swal.showInputError("Your folder name can't be blank");
      return false
    }
    FM_Mkdir(currentdir+inputValue);
    FM_DisplayCurrentDir(currentdir);
  });
});

function FM_Mkdir(dir){
  isloggedin();
  var req = {containerid: $_GET("id"), dir: dir};
        $.ajax({
           type:"POST",
           url: "/api/containers/filemanager/mkdir",
           data: JSON.stringify(req),
           beforeSend: function (request)
           {
               request.setRequestHeader("Authorization", localStorage.getItem("token"));
           },
           success: function(result) {
              pagealert("success", "Folder Created");
            },
            error: function(result) {
              pagealert("error", result.responseText);
            },
   });
}

$('#fm-rename').click(function() {
	var elements = new Array();
    $("input[name='checkrowbox']:checked").each(function () {
      elements.push($(this).val());
    });

    if (elements.length == 1) {
		  swal({
			title: "Rename file",
			text: "Enter your new name for your file:",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: true,
			animation: "slide-from-top",
			inputPlaceholder: "New file name"
		  },
		  function(inputValue){
			if (inputValue === false) return false;

			if (inputValue === "") {
			  swal.showInputError("Your file name can't be blank");
			  return false
			}
			FM_Rename(currentdir+elements[0], currentdir+inputValue);
			FM_DisplayCurrentDir(currentdir);
		  });
	}else{
		pagealert("error", "You can only rename one element at a time");
	}
});

function FM_Rename(dir, newdir){
  isloggedin();
  var req = {containerid: $_GET("id"), file: dir, newfile: newdir};
        $.ajax({
           type:"POST",
           url: "/api/containers/filemanager/rename",
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
}

function FM_SetDir(dir){
  if (dir == "/"){
	  currentdir = dir
  }else{
  currentdir += dir + "/";
  }
  FM_DisplayCurrentDir(currentdir);
}

function FM_DisplayCurrentDir(dir){
  $('#filemanage_table').html("")
  if(dir != "/"){
    p = $('<tr>');
    p.append(`<td></td><td class="move-left"><i class="fa fa-folder"></i>&nbsp;&nbsp;<a href="javascript:void(0)" onclick='FM_SetDir("/");'> / </a></td>`);
    $('#filemanage_table').append(p);
  }
  p = $('<tr>');
  p.append(`<td></td><td class="move-left"><i class="fa fa-folder-open"></i>&nbsp;&nbsp;` + dir + `</td>`);
  $('#filemanage_table').append(p);
  FM_DisplayDirs(dir);
  FM_DisplayFiles(dir);
}

function FM_DisplayDirs(dir){
  isloggedin();
  var req = {containerid: $_GET("id"), dir: dir};
        $.ajax({
           type:"POST",
           url: "/api/containers/filemanager/listdirs",
           data: JSON.stringify(req),
           beforeSend: function (request)
           {
               request.setRequestHeader("Authorization", localStorage.getItem("token"));
           },
           success: function(result) {
       var data = JSON.parse(result);
       var p;
       if (data != null){
         for (var i = 0; i < data.length; i++) {
           p = $('<tr>');
           p.append(`<td class="col-md-1"><input name="checkrowbox" type="checkbox" value="` + data[i] + `"></td><td class="move-left"><i class="fa fa-folder"></i>&nbsp;&nbsp;<a href="javascript:void(0)" onclick='FM_SetDir("`+ data[i] +`");'>` + data[i] + `</a></td>`);
           $('#filemanage_table').append(p);
         }
       }
     },
     async: false,
   });
}

function FM_DisplayFiles(dir){
  isloggedin();
   var req = {containerid: $_GET("id"), dir: dir};
        $.ajax({
           type:"POST",
           url: "/api/containers/filemanager/listfiles",
           data: JSON.stringify(req),
           beforeSend: function (request)
           {
               request.setRequestHeader("Authorization", localStorage.getItem("token"));
           },
           success: function(result) {
       var data = JSON.parse(result);
       var p;
       if (data != null){
         for (var i = 0; i < data.length; i++) {
           p = $('<tr>');
           p.append(`<td class="col-md-1"><input name="checkrowbox" type="checkbox" value="` + data[i] + `"></td><td class="move-left"><i class="fa fa-file"></i>&nbsp;&nbsp;` + data[i] + `</td>`);
           $('#filemanage_table').append(p);
         }
       }
     },
     async: false,
   });
}

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
        if (data != null){
  				for (var i = 0; i < data.manage_logs.length; i++) {
    					if (data.manage_logs[i].serviceid != 0){
    					tr = $('<tr>');
    					tr.append("<td>" + data.manage_logs[i].action + "</td>");
    					tr.append("<td>" + convertTimestamp(data.manage_logs[i].timestamp) + "</td>");
    					$('#managelog_table').append(tr);
    					}
  				  }
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
				$("#db_hostname").html("<strong>Domain: </strong>"+data.hostname);
				$("#db_username").html("<strong>Username: </strong>"+data.username);
				$("#db_password").html("<strong>Password: </strong>"+data.password);
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

				if (data.cnameenabled == false && data.torenabled == false){
					window.location.assign("/app/validatedomain?id="+$_GET("id"));
				}

				if (data.torenabled == true){
						$("#force-https").hide();
            $("#change-domain").hide();
            $("#firewall").hide();
				}

				SetManageStatus(data.status);
				if (data.sslenabled){
					$('#https-box').prop('checked', true);
				}
				currentpackage = data.packageid;
				$("#hostname").html("<strong>Domain: </strong><a href='http://"+data.hostname+"'>"+data.hostname+"</a>");
				$("#service").html("<strong>Service: </strong>"+"<i class='fa " + serviceicon(data.serviceid) +  "'></i> "+data.serviceid);
				$("#status").html("<strong>Status: </strong>"+website_status(data.status));
				$("#package").html("<strong>Package: </strong>"+packagename(data.packageid));
				$("#expires").html("<strong>Due date: </strong>"+GiveDate(data.expires_stamp));
            },
            async: false,
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
				        SetManageStatus(1);
                pagealert("success", "Website has been tasked to start");
            },
            error: function(result) {
				          pagealert("error", result.responseText);
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
                SetManageStatus(0);
                pagealert("success", "Website has been tasked to stop");
            },
            error: function(result) {
				        pagealert("error", result.responseText);
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
                SetManageStatus(1);
                pagealert("success", "Website Restarted");
            },
            error: function(result) {
				        pagealert("error", result.responseText);
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
                pagealert("success", "Database uploaded!<br>Starting import");
            },error: function(result){
                pagealert("error", result.responseText);
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
                pagealert("success", "Website uploaded!<br>Starting import");
            },error: function(result){
                pagealert("error", result.responseText);
            }
         });
      });

function FM_Upload(){
          isloggedin();
          var formdata = new FormData(document.querySelector("#fm-form"));
          formdata.set("containerid", $_GET("id"));
          formdata.set("dir", currentdir);

              $.ajax({
      			xhr: function() {
      				var xhr = new window.XMLHttpRequest();
      				xhr.upload.addEventListener("progress", function(evt) {
      					if (evt.lengthComputable) {
      						var percentComplete = (evt.loaded / evt.total) * 100;
      						if (percentComplete == 100){
      							$("#filemanage_progress").hide();
      							$("#filemanage_progressbar").css("width", "0%")
      						}else{
      							$("#filemanage_progress").show();
      							$("#filemanage_progressbar").css("width", percentComplete+"%")
      						}
      					}
      			   }, false);
      			   return xhr;
      			},
                  url: "/api/containers/filemanager/upload",
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
                      pagealert("success", "File Uploaded!");
                      FM_DisplayCurrentDir(currentdir);
                  },error: function(result){
                      pagealert("error", result.responseText);
                  }
               });
            }

function SetManageStatus(status){
  if (status == 1){
	currentstatus = 1;
    $("#stop").removeClass("disabled");
    $("#start").addClass("disabled");
  }else if(status == 0){
	currentstatus = 0;
    $("#start").removeClass("disabled");
    $("#stop").addClass("disabled");
  }else {
    $("#start").removeClass("disabled");
    $("#stop").removeClass("disabled");
  }
}

$("#package_upgrade").click(function(){
	var req = {containerid: $_GET("id"), packageid: parseInt(document.querySelector('input[name="PID"]:checked').value)};
	if (document.querySelector('input[name="PID"]:checked') == null){
		pagealert("error", "You forgot to select a package");
	}else{
    isloggedin();
          $.ajax({
             type:"POST",
             url: "/api/containers/upgrade",
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
  }
});

function getpackages(){
		   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/packages",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
					if (data[i].id != currentpackage) {
						tr = $("<input class='deploy_checkbox' name='PID' value='" + data[i].id + "' id='PID"+data[i].id+"' type='radio'></input>");
						lbl = $("<label for='PID" + data[i].id + "'> <span class='deploy_checkbox_icon'><i class='fa fa-money package_icon' style='font-size: 1em;'></i></span><span class='deploy_checkbox_line1'>" + data[i].name + ": $"+data[i].price+"/Month</span></span><span class='deploy_checkbox_line2'>"+data[i].ram+"MB RAM "+data[i].diskspace+"GB Disk</span></label>");
						$('#packages_list').append(tr);
						$('#packages_list').append(lbl);
					}
				}
      }
    });
}
