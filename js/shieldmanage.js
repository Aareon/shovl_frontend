var currentservice = ""
var currentedit = ""
$(document).ready(function(){
  getinfo();
  IsAdmin();
  getservices();
  $('tr').click(function(event) {
    if (event.target.type !== 'checkbox') {
      $(':checkbox', this).trigger('click');
    }
  });
  setInterval(function(){
    getinfo();
  }, 2500);
});

function getinfo(){
    var hostname = {hostname: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/shield/view",
            data: JSON.stringify(hostname),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
        //Display subdomains
        for (var i = 0; i < data.subs.length; i++) {
            tr = $('<tr>');
            tr.append("<td>" + data.subs[i].domains[0] +"</td>");
            tr.append("<td>" + data.subs[i].host+":"+ data.subs[i].port + "</td>");
            tr.append(`<td><button class='btn btn-info' type='button' onclick='EditSub("`+data.subs[i].domains[0]+`", "`+data.subs[i].host+`", "`+data.subs[i].port+`")'>Edit</button></td>`);
            $("dns-table").append(tr);
        }
				if (data.forcehttps){
					$('#forcehttps-box').attr('checked', true);
				}
        if (data.cachedisabled){
          $('#cache-box').attr('checked', true);
        }
        if (data.wafdisabled == false){
          $('#waf-box').attr('checked', true);
        }
        currentservice = data.serviceid;
        $("#hostname-title").html(data.hostname);
        $("#devmode-info").html("<i class='fa fa-hdd-o' style='font-size: 1.5em;'></i><strong> Developent Mode: </strong>"+isenabled(data.cachedisabled));
        $("#plan-info").html("<i class='fa fa-user' style='font-size: 1.5em;'></i><strong> Plan: </strong>"+data.serviceid);
        $("#ssl-info").html("<i class='fa fa-lock' style='font-size: 1.5em;'></i><strong> SSL: </strong>"+isenabled(data.sslenabled));
        $("#cache-info").html("<i class='fa fa-shield' style='font-size: 1.5em;'></i><strong> WAF: </strong>"+isenabled(!data.wafdisabled));
            },
    });
}

function isenabled(bool){
  var result = ""
  if (bool){
    result = "Enabled"
  }else{
    result = "Disabled"
  }
  return result
}

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
                        tr.append(`<td><button class='btn btn-danger' type='button' onclick='DeleteFirewallRule("`+data[i].ipcidr+`", false)'>Delete</button></td>`);
                        $("#firewall-table").append(tr)
                      }
                }
                for (var i = 0; i < data.length; i++) {
                      if (data[i].block == true) {
                        tr = $('<tr>');
                        tr.append("<td>" + "<div class='red'>Block</div>" +"</td>");
                        tr.append("<td>" + data[i].ipcidr + "</td>");
                        tr.append(`<td><button class='btn btn-danger' type='button' onclick='DeleteFirewallRule("`+data[i].ipcidr+`", true)'>Delete</button></td>`);
                        $("#firewall-table").append(tr)
                      }
                }
              }
            },
    });
}

function DeleteFirewallRule(ipcidr, isblocked){
        var container = {containerid: $_GET("id"), ipcidr: ipcidr, block: isblocked};
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

$('#auto-renew').click(function() {
	var ischecked = false
	if ($(this).is(':checked')){
		ischecked = true
	}
	var req = {containerid: $_GET("id"), enabled: ischecked};
        $.ajax({
           type:"POST",
           url: "/api/containers/autorenew",
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

$('#waf-box').click(function() {
	var req = {hostname: $_GET("id"), enabled: $(this).prop(('checked'))};
        $.ajax({
           type:"POST",
           url: "/api/shield/settings/waf",
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

$('#cache-box').click(function() {
	var req = {hostname: $_GET("id"), enabled: $(this).prop(('checked'))};
        $.ajax({
           type:"POST",
           url: "/api/shield/settings/cache",
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

$('#forcehttps-box').click(function() {
	var req = {hostname: $_GET("id"), enabled: $(this).prop(('checked'))};
        $.ajax({
           type:"POST",
           url: "/api/shield/settings/https",
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

$("#service_upgrade").click(function(){
	var req = {hostname: $_GET("id"), servceid: parseInt(document.querySelector('input[name="SID"]:checked').value)};
	if (document.querySelector('input[name="SID"]:checked') == null){
		pagealert("error", "You forgot to select a package");
	}else{
    isloggedin();
          $.ajax({
             type:"POST",
             url: "/api/containers/service",
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

function getservices(){
		   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/shield/services/list",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				var tr;
				for (var i = 0; i < data.length; i++) {
          if (data.name != currentservice) {
					tr = $("<input class='deploy_checkbox' name='SID' value='" + data[i].name + "' id='SID"+data[i].name+"' type='radio'></input>");
					lbl = $("<label for='SID" + data[i].name + "'> <span class='deploy_checkbox_icon'><i class='fa fa-money package_icon' style='font-size: 1em;'></i></span><span class='deploy_checkbox_line1'>" + data[i].name + ": $"+data[i].price+"/Month</span></span></label>");
					$('#services_list').append(tr);
					$('#services_list').append(lbl);
          }
				}

            }
    });
}
