$(document).ready(function(){
    $("#password_div").hide();
    //Load user information in details
   // $("#country").val("US");
   Fetch from webserver as JSON using JWT call
}); 
//Tab system for menu
$("#password_tab").click(function(){
    $("#profile_div").hide();
    $("#password_div").show();
    $("#profile_tab").removeClass('pure-menu-selected');
    $('#password_tab').addClass('pure-menu-selected');
})

$("#profile_tab").click(function(){
    $("#password_div").hide();
    $("#profile_div").show();
    $('#password_tab').removeClass('pure-menu-selected');
    $("#profile_tab").addClass('pure-menu-selected');
})
