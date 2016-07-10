
function isloggedin(){
	if(localStorage.getItem("token") === null){
			window.location.assign("/app/login.html");
		}
	if (localStorage.getItem("expires") < Math.floor(Date.now() / 1000)){
			window.location.assign("/app/login.html");
	}	
}

function success_color(element){
    $(element).removeClass('red');
    $(element).addClass('green');	
}

function error_color(element){
    $(element).removeClass('green');
    $(element).addClass('red');	
}

function logout(){
	localStorage.removeItem("token");
	localStorage.removeItem("expires");
	localStorage.removeItem("refresh_token");
	isloggedin();
}

function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	
	// ie: 2013-02-18, 8:35 AM	
	time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
		
	return time;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

function IsAdmin() {
	var status = false;
	isloggedin();
    $.ajax({
            type:"GET",
            url: "/api/account/whoami",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {	
				localStorage.setItem("status", true);
            },
            error: function(result) {
				localStorage.setItem("status", false);	
			}
    });	
    status = localStorage.getItem("status"); 	
    return status;
}

$("#signout").click(function(){
     logout();
});

$(document).ready(function(){
isloggedin();	
}); 
