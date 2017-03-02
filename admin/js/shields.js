var admin_offset = 0
var attacks_offset = 0
$(document).ready(function(){
	isloggedin();
    getshields();
    getattacks();
});

$("#attacksloadmore").click(function(){
	if ($("#attacksloadmore").hasClass("disabled") == false){
		attacks_offset += 1
		getattacks(attacks_offset);
	}
});

function forHumans ( seconds ) {
    var levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
    ];
    var returntext = '';

    for (var i = 0, max = levels.length; i < max; i++) {
        if ( levels[i][0] === 0 ) continue;
        returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
    };
    return returntext.trim();
}

function getattacks(offset){
		   isloggedin();
		   	var req = {offset: offset};
            $.ajax({
            type: "POST",
            url: "/api/admin/attacks",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
							var data = JSON.parse(result);
							var tr;
							for (var i = 0; i < data.attack_logs.length; i++) {
									tr = $('<tr/>');
									tr.append("<td>" + data.attack_logs[i].domain +"</td>");
									tr.append("<td>" + data.attack_logs[i].averagerps + "r/s" + "</td>");
									tr.append("<td>" + data.attack_logs[i].peakrps + "r/s" + "</td>");
									if (data.attack_logs[i].duration != 0){
										tr.append("<td>" + forHumans(data.attack_logs[i].duration) + "</td>");
									}else {
										tr.append("<td>" + "<p class='text-danger'>Ongoing</p>" + "</td>");
									}
									tr.append("<td>" + convertTimestamp(data.attack_logs[i].start_stamp) + "</td>");
									if (data.attack_logs[i].end_stamp != 0){
										tr.append("<td>" + convertTimestamp(data.attack_logs[i].end_stamp) + "</td>");
									}else {
										tr.append("<td>" + "<p class='text-danger'>Ongoing</p>" + "</td>");
									}
									$('#attacks_table').append(tr);
							}
							if (data.canloadmore) {
								 $("#attacksloadmore").removeClass("disabled")
							}else {
								 $("#attacksloadmore").addClass("disabled")
							}
            }
    });
}

$("#adminloadmore").click(function(){
	if ($("#adminloadmore").hasClass("disabled") == false){
		admin_offset += 1
		getshields(admin_offset);
	}
});

function getshields(offset){
		   isloggedin();
		   	var req = {offset: offset};
            $.ajax({
            type: "POST",
            url: "/api/admin/shields",
            data: JSON.stringify(req),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
							var data = JSON.parse(result);
							var tr;
							for (var i = 0; i < data.shields.length; i++) {
									tr = $('<tr/>');
									tr.append("<td>" + "<i class='fa fa-shield web_icon'></i>" +"</td>");
									tr.append("<td>" + userlink(data.shields[i].email)+data.shields[i].email+"</a>" + "</td>");
									tr.append("<td>" + link(data.shields[i].hostname)+data.shields[i].hostname+"</a>" + "</td>");
									tr.append("<td>" + data.shields[i].serviceid + "</td>");
									if (data.shields[i].serviceid == "Free"){
													tr.append("<td>" + "expires: never" + "</td>");
									}else{
													tr.append("<td>" + "expires: " +GiveDate(data.shields[i].expires_stamp) + "</td>");
									}
									$('#service_table').append(tr);
							}
							if (data.canloadmore) {
								 $("#adminloadmore").removeClass("disabled")
							}else {
								 $("#adminloadmore").addClass("disabled")
							}
            }
    });
}

function link(id){
		return '<a href="/app/shield-manage?id='+id+'">';
}
