$("#record-create").click(function(){
  var type = $("#record-type").val();
  var req;

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
