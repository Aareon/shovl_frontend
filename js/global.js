function isloggedin(){
	if(localStorage.getItem("token") === null){
			window.location.assign("/app/login");
		}
	if (localStorage.getItem("expires") < Math.floor(Date.now() / 1000)){
			var refresh = {refresh_token: localStorage.getItem("refresh_token")};
			$.ajax({
            type:"POST",
            url: "/api/account/refreshtoken",
            data: JSON.stringify(refresh),
            success: function(result) {
				var data = JSON.parse(result);
				localStorage.setItem("token", data.token);
				localStorage.setItem("expires", data.expires);
				localStorage.setItem("refresh_token", data.refresh_token);
            },
            error: function(result) {
                localStorage.setItem("lastlink", window.location.pathname);
				window.location.assign("/app/login");
            },
            async: false
			});
	}
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$(function() {
		$('.sidenav-toggle').click(function() {
				$('.sidenav').toggle();
				$('.sidenav-mini').toggle();
				$('#sidenav-offset').toggleClass('sidenav-offset');
		})
})

function pagealert(type, message){
	if (type == "success"){
		$("#alertbox").html(`<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Well Done!</strong><br>`+message+`</div>`);
	}else if (type == "info"){
		$("#alertbox").html(`<div class="alert alert-info"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong><br>`+message+`</div>`);
	}else if (type == "warning"){
		$("#alertbox").html(`<div class="alert alert-warning"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong><br>`+message+`</div>`);
	}else if (type == "error"){
		$("#alertbox").html(`<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Oh snap!</strong><br>`+message+`</div>`);
	}
}

function logout(){
	 $.ajax({
            type:"GET",
            url: "/api/account/logout",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
    });
    localStorage.removeItem("token");
	localStorage.removeItem("expires");
	localStorage.removeItem("refresh_token");

	window.location.assign("/app/login");
}

function success_color(element){
    $(element).removeClass('red');
    $(element).addClass('green');
}

function error_color(element){
    $(element).removeClass('green');
    $(element).addClass('red');
}

function GiveDate(timestamp) {
  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		time;
	time = yyyy + '-' + mm + '-' + dd;

	return time;
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
				status = true;
				$("#adminpanel").show();
            },
            error: function(result) {
				stauts = false;
			},
			async: false
    });
    return status;
}

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

$("#signout").click(function(){
     logout();
});

function website_status(code){
	var response;
	if(code == 0){
		response = "<div class='red'>Stopped</div>";
	}else if(code == 1){
		response = "<div class='green'>Running</div>";
	}else if(code == 2){
		response = "<div class='orange'>Upgrading</div>";
	}else if(code == 3){
		response = "<div class='red'>Suspended</div>";
	}
	return response;
}

function serviceicon(id){
	return localStorage.getItem("service_"+id)
}

function packagename(id){
	return localStorage.getItem("package_"+id)
}

function getservices(){
		   isloggedin();
            $.ajax({
            type:"GET",
            url: "/api/services",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				for (var i = 0; i < data.length; i++) {
					localStorage.setItem("service_"+data[i].name,data[i].icon)
				}
            }
    });
}

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
				for (var i = 0; i < data.length; i++) {
					localStorage.setItem("package_"+data[i].id,data[i].name)
				}

            }
    });
}

$(document).ready(function(){
isloggedin();
});

/* Tribute to the NSA
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,~:,,,,,,,,,,,,?Z:,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,I7:,:,,,,,~Z?,,,,,,,,,,,,=Z?,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,~?7:,,,=:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,I$+,,,,,,,,Z$,,,,,,,,,,,,:$Z,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,+$Z$?:,=$ZZZ~,,=7~,,,,,,,,,,,,,,,7Z$+,,,,,,,,,=Z$:,,:,,,,$7,,,,,,,,,,,,,7Z+,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,:7Z7=,,,:$$+,,,,,,:Z$,,,,::,,,,,,,,+$:+Z$:,,,,,,,=ZZ:,,,,:~~7Z:,,~~~+~,,+I=?Z?,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,+ZI,,,,,=Z=,,,,,,,:Z$,::::,,,,,,,::Z~,,~ZI:,,,,:,,$Z:,,,7ZZ$$Z~:$Z7$Z$:7$~?7Z?,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,~$Z$I~,,:IZZO$=,::ZZ,,,,,,,,,,,,,+O:,,:IZ?,,:$$7$ZZ:,,IOI,~ZZ?Z$?$O?,7Z:,,:Z7,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,:=7ZZ~:,,::+Z$:=Z7,,,::,,,,,,,,=OOOZ$?$Z:,=Z+,=ZZ~,,7Z,,$77ZZ+~~,,,$?,,,IZZ:,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,7Z+,,,,,,+O==Z$:,:~:,,,,,,,,:ZZ~,,,=O?,:Z?:77ZI:,7Z:+Z=,IZZ,,,:,$I,,~Z?OI,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,IO$+=IZZ=IZ?,,~ZO=~Z$Z$I~,,,,,,,,,:OO=,,,:Z?,:$ZZZ:,?+,=ZZZ+,:,~$Z?:$Z?Z$ZO=,=?,,,,,=:,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,~7$Z?::,=7$ZZ7~,=OZZ$$O+,,,,,,,,,7O?,,,,,,,,,=~,,,,,,,,:,,,,,:,=?I=,,,==,:,,,,,,,,:,,,,,7?,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,,:7~,==,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,7Z=,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,IZ$:,,,,,,,
,,,,,,,,,,,,:,,,,,,,,,,,,,,,II,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~Z77,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,=Z$::,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,?ZI?,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,$Z7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,,,:+++=,,,,,:Z7Z:,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:ZZ?,,,,,,,,,,,,,,,,,,,,,,,:=?+$ZZ$$?:,,,,=~,,,=ZI,,,,,IZZ$?,,,,,:$+,,?$~:$I,,,++=?ZZ=,,,,,
,,,,,~I$Z$?$I,,,,,,,=Z$~,,::::+ZZ~,,,,,,,,,,,,,,:$OOOOOZZ?$7:,,:~$+,::ZI7Z:I$~IZ:,7Z7~,:7$I:,,,=Z~?Z:=Z=,,,ZZ+=+$Z~,,,,,
,,,,:$$:,+?7Z+,,,,,7$,?Z,,7Z7I+7Z7,,,,,,,,,,,,,,,$ZI~,,,,~O:,,,,IZ:,:$$::$$$I::Z+,Z7,,,:~Z$=,,,,$I7ZIZ~,,,~Z+,:,=ZI,,,,,
,,,,=Z~,,,,,$$,,,,,Z,,,7$,$$,,:,7Z~,,,,,,,,,,,,,,,+7,,,,,=Z+,~$Z7:,,:$Z:,:ZZI,:IO:IZ:,,:+$~Z7~:?O?7$,,:,,,:Z?,,,ZIO+,,,,
,,:,,$$,,,,,$Z?,,:7Z:,,~Z==O+,,,=ZZ,,,,,,,,,,,,,,,,$7:,,,:7Z$?~,,,,:,$Z?,,+Z+,,:Z?,IZ+:=Z=,:+I$$?,+$+,,~I~,IZI?ZI,,,,,,,
,,,,,:7Z+,:$$?O+,,?Z+,,,7Z:IZ~,,=Z$O::,,,,,,,,,,,,,+OI,,,,,?ZZ$II$Z=~=ZZ:,:,,,,,+?~,,777+,,,,,,,,,,~$ZZ+,:,,,+?:,,,,,,,,
,,,,,,,?ZZZ$:,+ZO=,=:,,,:I:,IZ77O=:ZZ~,,,,,,,,,,,,,,IZI,,,,,:+77I=,,,,+I,,,,,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,::,,,,,,,,,,,,,~~,,,,?OI,,,,,,,,,,,,,,~~,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:?:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,$Z~,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,I=,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~Z$,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~Z~,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,$Z:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,7Z,:,:=~,,,,,,,,,,,:,,,,,,,,::,,,,:::,,,,,,,IZ+,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~Z?,7$~7$=,,,,,:~++~,,,,,~:,,,=$ZI??Z=,,,,,,~$$,,,,,,,,,,,,,,,,:?I,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,?Z?Z~,:=Z+,,:$Z77$Z~,,IO++I$$Z~,,:7$,,,,,,:,7ZI,,,,,,,,,,,,,,,:Z$$=,,,,,,,=$Z=,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,$$Z:,,,?Z~,7O~,~$$,:,IO:,,,=Z~??$I:,,,,,,,,=$?,,,,,,,,,,,,,,,,,,,~~,,,,,::77=:,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,=ZO:,,,,7$,IZ7$Z7,,,:$Z7:,,,$7,,,,,,,,,,,,,,,,,,,,,,,,,,+7~,,,,,,,,++,,,:,,,,:::,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,$Z?,,,,~ZI,ZZ+,,,,~$:,7$,,,=$$~,,,:I,,,,,,,,,,,,,,,,,,,IZ7,,,,,,,,$$,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:Z?,,,,,IO=:$ZI=?7Z=,,~$+,,,=$ZZ$$$7,,,,,,,,,,,,,,,,,,:,7$7,,,,,,:ZI,,,,,,,,,:::,,,,:,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,+7,,:I7I+,,,:,==,,,:,:~+?+,,,,,,,,,:I,,,,,,,,,,,IZ$:,,,,?$?:,,,,,,,,,,:7+,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,7$+,,,,,,,,,,,+ZZ+,,,+ZZZOZZO=,,:,=$Z+,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~:,,,,,,,,,,,,,=$Z7+:,,:,:==~,,,:IZ$+~,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:,,,,,,,,,,,,,,,+$ZZZ7+~:,,:~+$ZZ?,,,:,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~I$ZZZZZZZZ$?:,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:~==::,,,,,,,,,,,,
*/
