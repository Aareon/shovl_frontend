$(document).ready(function(){
	setInterval(function(){
		getstats();
		getmetrics();
		getattacks();
	}, 1000);
});

function getmetrics(){
	isloggedin();
				$.ajax({
					 type:"GET",
					 url: "/api/admin/stats",
					 beforeSend: function (request)
					 {
							 request.setRequestHeader("Authorization", localStorage.getItem("token"));
					 },
					 success: function(result) {
						 var data = JSON.parse(result);
						 $("#cpu").html("<span>"+data.cpu+"%</span>");
						 $("#cpu").css("width", data.cpu+"%");

						 $("#memory").html("<span>"+data.memory+"% "+data.memoryused+"MB/"+data.memorytotal+"MB"+"</span>");
						 $("#memory").css("width", data.memory+"%");

						 $("#disk").html("<span>"+data.disk+"% "+data.diskused+"GB/"+data.disktotal+"GB"+"</span>");
						 $("#disk").css("width", data.disk+"%");
				 },
	 });
}

function getattacks(offset){
		   isloggedin();
            $.ajax({
            type: "GET",
            url: "/api/admin/liveattacks",
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
            }
    });
}

function UpdateBackend(){
		   isloggedin();
            $.ajax({
            type: "GET",
            url: "/api/admin/update",
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

function UpdateCDN(){
		   isloggedin();
            $.ajax({
            type: "GET",
            url: "/api/admin/cdnupdate",
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


var dps = [];
var aps = [];

var chart = new CanvasJS.Chart("chartContainer",{
			title :{
				text: "Shovl Global Network Traffic"
			},
			axisX:{
				title: "Time",
				valueFormatString: "m s"
			  },
			  axisY:{
				title: "Request/s"
			  },
			data: [
			{
				name: "Attack Traffic",
				legendMarkerType: "square",
				showInLegend: true,
				type: "splineArea",
				color: "rgba(192, 57, 43,1.0)",
				dataPoints: aps
			},
			{
				name: "Clean Traffic",
				legendMarkerType: "square",
				showInLegend: true,
				type: "splineArea",
				color: "rgba(39, 174, 96,1.0)",
				dataPoints: dps
			}]
		});

function updatechart(good, bad) {
			var xVal = new Date();
			dps.push({
					x: xVal,
					y: good
			});
			aps.push({
					x: xVal,
					y: bad
			});
			if (dps.length > 300)
			{
				dps.shift();
			}
			if (aps.length > 300)
			{
				aps.shift();
			}
			chart.render();
};

function getstats(){
    var hostname = {hostname: "*"};
	 isloggedin();
         $.ajax({
            type:"POST",
            url: "/api/shield/stats",
            data: JSON.stringify(hostname),
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
            },
            success: function(result) {
				var data = JSON.parse(result);
				updatechart(data.goodrps, data.badrps);
          },
    });
}
