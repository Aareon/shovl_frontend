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
