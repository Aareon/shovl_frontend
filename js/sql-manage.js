var logs_offset = 0
//File Manager global vars
$(document).ready(function(){
  getinfo();
  getdbinfo();
  getdatabases();
  $('tr').click(function(event) {
    if (event.target.type !== 'checkbox') {
      $(':checkbox', this).trigger('click');
    }
  });
  setInterval(function(){
    getinfo();
  }, 2500);
});

function reloaddatabases(){
  $("#database-table").html("");
  getdatabases();
}

function getdatabases(){
	 isloggedin();
         $.ajax({
            type:"GET",
            url: "/api/account/database/list",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
          		var data = JSON.parse(result);
          		var p;
              if (data != null) {
                  for (var i = 1; i < data.length; i++) {
						  if (data[i] != "information_schema" && data[i] != "performance_schema" && data[i] != "sys" && data[i] != "mysql"){
                          tr = $('<tr>');
                          tr.append("<td>" + data[i] + "</td>");
                          tr.append(`<td><button class='btn btn-danger' type='button' onclick='DeleteDatabase("` + data[i] + `")'>Delete</button></td>`);
                          $("#database-table").append(tr)
						}
                  }
                }
            },
    });
}

$('#db-create').click(function() {
		  swal({
			title: "Create Database",
			text: "Enter your new databases name:",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: true,
			animation: "slide-from-top",
			inputPlaceholder: "New Database Name"
		  },
		  function(inputValue){
			if (inputValue === false) return false;

			if (inputValue === "") {
			  swal.showInputError("Your database name can't be blank");
			  return false
			}
			SendCreateDatabase(inputValue);
		  });
});

function DeleteDatabase(database){
			swal({
		  title: "WARNING! Are you sure you want to delete this database?",
		  text: "You will not be able to recover this data",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes, delete it!",
		  closeOnConfirm: true
		},
		function(){
			SendDeleteDatabase(database);
		});
}


function SendCreateDatabase(database){
        var container = {database: database};
        isloggedin();
        $.ajax({
          type:"POST",
          url: "/api/account/database/create",
          data: JSON.stringify(container),
          beforeSend: function (request)
          {
              request.setRequestHeader("Authorization", localStorage.getItem("token"));
          },
          success: function(result) {
              pagealert("success", result);
              reloaddatabases();
          },
          error: function(result) {
              pagealert("error", result.responseText);
          },
      });
}

function SendDeleteDatabase(database){
        var container = {database: database};
        isloggedin();
        $.ajax({
          type:"POST",
          url: "/api/account/database/delete",
          data: JSON.stringify(container),
          beforeSend: function (request)
          {
              request.setRequestHeader("Authorization", localStorage.getItem("token"));
          },
          success: function(result) {
              pagealert("success", result);
              reloaddatabases();
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

function toBinaryString(data) {
    var ret = [];
    var len = data.length;
    var byte;
    for (var i = 0; i < len; i++) {
        byte=( data.charCodeAt(i) & 0xFF )>>> 0;
        ret.push( String.fromCharCode(byte) );
    }

    return ret.join('');
}

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
				$("#notice").html("<strong>For website configurations the hostname is 'mysql' but for PHPMyAdmin access, use the hostname below</strong>");
				$("#db_hostname").html("<strong>Hostname: </strong>"+data.hostname);
				$("#db_username").html("<strong>Username: </strong>"+data.username);
				$("#db_password").html("<strong>Password: </strong>"+data.password);
            },
    });
}

var lastgetinfo;
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
        if (lastgetinfo != result){
          lastgetinfo = result;

  				currentpackage = data.packageid;
  				$("#hostname").html("<strong>Domain: </strong><a href='http://"+data.hostname+"'>"+data.hostname+"</a>");
  				$("#service").html("<strong>Service: </strong>"+"<i class='fa " + serviceicon(data.serviceid) +  "'></i> "+data.serviceid);
  				$("#status").html("<strong>Status: </strong>"+website_status(data.status));
  				$("#package").html("<strong>Package: </strong>"+packagename(data.packageid));
  				$("#expires").html("<strong>Due date: </strong>"+GiveDate(data.expires_stamp));
        }
            },
    });
}

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
