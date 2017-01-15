$("#record-create").click(function(){
  var type = $("#record-type").val();
  var req;
  var name = "";
  if ($("#record-name").val() != "") {
    name = $("#record-name").val() + ".";
  }
  if (type == "MX"){
      req = {hostname: name+$_GET("id"), protected: $("shield-box").is(":checked"), type: type, record_mx_server: $("#record-mx-server").val(), record_mx_priority: $("#record-mx-priority").val()};
  }else if (type == "A"){
      req = {hostname: name+$_GET("id"), protected: $("shield-box").is(":checked"), type: type, record_a: $("#record-a").val()};
  }else if (type == "AAAA"){
      req = {hostname: name+$_GET("id"), protected: $("shield-box").is(":checked"), type: type, record_aaaa: $("#record-aaaa").val()};
  }else if (type == "TXT"){
      req = {hostname: name+$_GET("id"), protected: $("shield-box").is(":checked"), type: type, record_txt: $("#record-txt").val()};
  }else if (type == "SPF"){
      req = {hostname: name+$_GET("id"), protected: $("shield-box").is(":checked"), type: type, record_spf: $("#record-spf").val()};
  }else if (type == "CNAME"){
      req = {hostname: name+$_GET("id"), protected: $("shield-box").is(":checked"), type: type, record_cname: $("#record-cname").val()};
  }else if (type == "SRV"){
      req = {hostname: name+$_GET("id"), protected: $("shield-box").is(":checked"), type: type, record_srv_target: $("#record-srv-target").val(), record_srv_protocol: $("#record-srv-protocol").val(), record_srv_port: $("#record-srv-port").val(), record_srv_weight: $("#record-srv-weight").val()};
  }
  $.ajax({
     type:"POST",
     url: "/api/shield/dns/create",
     data: JSON.stringify(req),
     beforeSend: function (request)
     {
         request.setRequestHeader("Authorization", localStorage.getItem("token"));
     },
     success: function(result) {
       $("#new-record-div").hide();
       pagealert("success", result);
    },
     error: function(result) {
       pagealert("error", result.responseText);
    },
 });
});

$("#record-type").change(function(){
  var type = this.value;
  HideDNSForms(type);
  if (type == "MX"){
    $("#val-mx").fadeIn(800);
  }else if (type == "A"){
      $("#val-a").fadeIn(800);
  }else if (type == "AAAA"){
      $("#val-aaaa").fadeIn(800);
  }else if (type == "TXT"){
      $("#val-txt").fadeIn(800);
  }else if (type == "SPF"){
      $("#val-spf").fadeIn(800);
  }else if (type == "CNAME"){
      $("#val-cname").fadeIn(800);
  }else if (type == "SRV"){
      $("#val-srv").fadeIn(800);
  }
});

function HideDNSForms(type){
  $("#val-a").hide();
  $("#val-aaaa").hide();
  $("#val-cname").hide();
  $("#val-spf").hide();
  $("#val-txt").hide();
  $("#val-srv").hide();
  $("#val-mx").hide();
}