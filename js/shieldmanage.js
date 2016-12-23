var currentservice = "";
var currentedit = "";
var ranonce = false;
$(document).ready(function(){
  getinfo();
  IsAdmin();
  getservices();
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

var beforedata;
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
              if (data != beforedata){
                beforedata = data;
                if (data.serviceid == "Free"){
                  $('#ssl-tab').hide();
                }
                //Display subdomains in table
                var allsubs = $('#dns-table').clone().html("");
                for (var i = 0; i < data.subs.length; i++) {
                    tr = $('<tr>');
                    tr.append("<td><strong>" + data.subs[i].domains[0] +"</strong></td>");
                    tr.append("<td>" + "<span class='text-muted'>points to </span>"+data.subs[i].host+":"+ data.subs[i].port + "</td>");
                    var deletebutton = ""
                    if (data.subs[i].domains[0] != data.hostname){
                      deletebutton = `<button class='btn btn-danger' type='button' onclick='DeleteSub("`+data.subs[i].name+`")'>Delete</button>`;
                    }else {
                      deletebutton = `<button class='btn btn-danger disabled' type='button' data-toggle='tooltip' title='You can only delete subdomains'>Delete</button>`;
                    }
                    tr.append(`<td><button class='btn btn-info' type='button' onclick='LoadSub("`+data.subs[i].name+`", "`+data.subs[i].host+`", "`+data.subs[i].port+`")'>Edit</button>`+deletebutton+`</td>`);
                    allsubs = allsubs.append(tr);
                }

                $('#dns-table').replaceWith(allsubs)
                //Display SSL subs
                var allsslsubs = $('#ssl-table').clone().html("");
                for (var i = 0; i < data.subs.length; i++) {
                    tr = $('<tr>');
                    tr.append("<td><strong>" + data.subs[i].domains[0] +"</strong></td>");
                    if (data.subs[i].sslenabled){
                      tr.append("<td>" + '<span class="label label-success">Installed</span>' + "</td>");
                      tr.append(`<td><button class='btn btn-info disabled' type='button'>Install</button>`+`<button class='btn btn-danger' type='button' onclick='DisableSSLSub("`+data.subs[i].name+`")'>Disable</button`+`</td>`);
                    }else if (data.subs[i].disabled){
                      tr.append("<td>" + '<span class="label label-warning">DNS Records Missing</span>' + "</td>");
                      tr.append(`<td><button class='btn btn-info disabled' type='button'>Install</button>`+`<button class='btn btn-danger disabled' type='button'>Disable</button`+`</td>`);
                    }else if (data.subs[i].sslenabled == false){
                      tr.append("<td>" + '<span class="label label-danger">Disabled</span>' + "</td>");
                      tr.append(`<td><button class='btn btn-info' type='button' onclick='InstallSSLSub("`+data.subs[i].name+`")'>Install</button>`+`<button class='btn btn-danger disabled' type='button'>Disable</button`+`</td>`);
                    }
                    allsslsubs = allsslsubs.append(tr);
                }

                $('#ssl-table').replaceWith(allsslsubs)

                //Load in settings
                $('#new-dns-domain').html("."+data.hostname);
                if (data.hstsenabled){
        					$('#hsts-box').attr('checked', true);
        				}
                if (data.gzipenabled){
        					$('#gzip-box').attr('checked', true);
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
                //$("#devmode-info").html("<i class='fa fa-hdd-o' style='font-size: 1.5em;'></i><strong> Development Mode: </strong>"+isenabled(data.cachedisabled));
                $("#plan-info").html("<i class='fa fa-user' style='font-size: 1.5em;'></i><strong> Plan: </strong>"+data.serviceid);
                //$("#ssl-info").html("<i class='fa fa-lock' style='font-size: 1.5em;'></i><strong> SSL: </strong>"+isenabled(data.sslenabled));
                $("#waf-info").html("<i class='fa fa-shield' style='font-size: 1.5em;'></i><strong> WAF: </strong>"+isenabled(!data.wafdisabled));
                //Hide record table if no disabled records
                var validate = 0
                for (var i = 0; i < data.subs.length; i++){
                  if (data.subs[i].disabled){
                    validate++
                  }
                }

                if (validate == 0){
                  $("#recheck-records-panel").hide();
                }else{
                  //Verify if atleast one subdomain is disabled/unconfirmed and display records
                  if (ranonce != true){
                        DisplayAllMissingRecords(data.subs);
                  }
                }
              }
          },
          error: function(result){
            window.location.assign("/app/shield");
          },
    });
}

$("#recheck").click(function(){
     ranonce = false;
     var req = {hostname: $_GET("id")};
     $.ajax({
        type:"POST",
        url: "/api/shield/recheck",
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

function DisplayAllMissingRecords(subs){
  $('#dnsrecord_table').html("");
  for (var i = 0; i < subs.length; i++){
    if (subs[i].disabled){
      DisplayMissingRecord(subs[i].domains[0])
    }
  }
  ranonce = true;
  $("#recheck-records-panel").show();
}

function DisplayMissingRecord(hostname){
  if ((hostname.split('.').length-1) > 1){
    tr = $('<tr>');
    tr.append("<td>" + "CNAME" +"</td>");
    tr.append("<td>" + hostname +"</td>");
    tr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
    $("#dnsrecord_table").append(tr);
  }else{
    firsttr = $('<tr>');
    firsttr.append("<td>" + "CNAME" +"</td>");
    firsttr.append("<td>" + hostname +"</td>");
    firsttr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
    $("#dnsrecord_table").append(firsttr);

    secondtr = $('<tr>');
    secondtr.append("<td>" + "CNAME" +"</td>");
    secondtr.append("<td>" + "www." + hostname +"</td>");
    secondtr.append("<td>" + "is an alias of <strong>firewall.shovl.io</strong>" + "</td>");
    $("#dnsrecord_table").append(secondtr);
  }
}

function LoadSub(name, host, port){
  $("#manage-dns").show();
  currentedit = name;
  $("#manage-dns-host").val(host);
  $("#manage-dns-port").val(port);
}

function InstallSSLSub(name){
  var req = {hostname: $_GET("id"), sub: name};
  $.ajax({
     type:"POST",
     url: "/api/shield/sub/sslinstall",
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

function DisableSSLSub(name){
  var req = {hostname: $_GET("id"), sub: name};
  $.ajax({
     type:"POST",
     url: "/api/shield/sub/ssldisable",
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

//Add confirm popup for this
function DeleteSub(name){
  var req = {hostname: $_GET("id"), sub: name};
  if (name == currentedit){
  $("#manage-dns").hide();
  }
  $.ajax({
     type:"POST",
     url: "/api/shield/sub/delete",
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

$("#sub-create").click(function(){
     $("#new-dns").toggle();
});

$("#delete-shield").click(function(){
    swal({
    title: "Are you sure you want to delete your shield?",
    text: "You will not be able to recover this data",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    closeOnConfirm: true
  },
  function(){
    var req = {hostname: $_GET("id")};
    $.ajax({
       type:"POST",
       url: "/api/shield/delete",
       data: JSON.stringify(req),
       beforeSend: function (request)
       {
           request.setRequestHeader("Authorization", localStorage.getItem("token"));
       },
       success: function(result) {
         pagealert("success", result);
         window.location.assign("/app/shield");
      },
       error: function(result) {
         pagealert("error", result.responseText);
      },
   });
  });
});

$("#new-dns-create").click(function(){
     var req = {hostname: $_GET("id"), sub: $("#new-dns-sub").val(), host: $("#new-dns-host").val(), port: parseInt($("#new-dns-port").val())};
     $.ajax({
        type:"POST",
        url: "/api/shield/sub/create",
        data: JSON.stringify(req),
        beforeSend: function (request)
        {
            request.setRequestHeader("Authorization", localStorage.getItem("token"));
        },
        success: function(result) {
          pagealert("success", result);
          $("#new-dns-sub").val("");
          $("#new-dns-host").val("");
          $("#new-dns-port").val("");
          $("#new-dns").hide();
       },
        error: function(result) {
          pagealert("error", result.responseText);
       },
    });
});

$("#manage-dns-update").click(function(){
     var req = {hostname: $_GET("id"), sub: currentedit, host: $("#manage-dns-host").val(), port: parseInt($("#manage-dns-port").val())};
     $.ajax({
        type:"POST",
        url: "/api/shield/sub/manage",
        data: JSON.stringify(req),
        beforeSend: function (request)
        {
            request.setRequestHeader("Authorization", localStorage.getItem("token"));
        },
        success: function(result) {
          pagealert("success", result);
          $("#manage-dns").hide();
       },
        error: function(result) {
          pagealert("error", result.responseText);
       },
    });
});

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
   var req = {hostname: $_GET("id")};
         $.ajax({
            type:"POST",
            url: "/api/shield/firewall/list",
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
        var container = {hostname: $_GET("id"), ipcidr: ipcidr, block: isblocked};
        isloggedin();
        $.ajax({
          type:"POST",
          url: "/api/shield/firewall/delete",
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
     var req = {hostname: $_GET("id"), ipcidr: $("#fr-ipcidr").val(), block: type};
     $.ajax({
        type:"POST",
        url: "/api/shield/firewall/new",
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
    swal({
    title: "Are you sure you want to renew your shield?",
    text: "You will be charged from your balance",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, Renew it!",
    closeOnConfirm: true
  },
  function(){
    var req = {hostname: $_GET("id")};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/shield/renew",
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

$('#hsts-box').click(function() {
	var req = {hostname: $_GET("id"), enabled: $(this).prop(('checked'))};
        $.ajax({
           type:"POST",
           url: "/api/shield/settings/hsts",
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

$('#gzip-box').click(function() {
	var req = {hostname: $_GET("id"), enabled: $(this).prop(('checked'))};
        $.ajax({
           type:"POST",
           url: "/api/shield/settings/gzip",
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
    swal({
    title: "WARNING! Are you sure you want to upgrade your shield?",
    text: "You will be charged from your balance",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, Upgrade it!",
    closeOnConfirm: true
  },
  function(){
    var req = {hostname: $_GET("id"), serviceid: document.querySelector('input[name="SID"]:checked').value};
  	if (document.querySelector('input[name="SID"]:checked') == null){
  		pagealert("error", "You forgot to select a package");
  	}else{
      isloggedin();
            $.ajax({
               type:"POST",
               url: "/api/shield/upgrade",
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
