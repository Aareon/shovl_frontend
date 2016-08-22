<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Shovl - Login</title>
<link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
<script src="https://code.jquery.com/jquery-3.0.0.min.js" integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0=" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
<link rel="stylesheet" href="css/layouts/externalglobal.css">
<link rel="stylesheet" href="css/layouts/login.css">
</head>
<body>

    <pep id="main" class="card">		
        <div class="content container">
            <h2 class="content-subhead"><img src="logo.png"></h2>         
            <space></space>
            <form class="pure-form pure-form-aligned">				
			<div class="pure-control-group">
				<input id="email_field" class="pure-input-1 form-large" type="email" placeholder="Email Address">
			</div>
			<space></space>
			<div class="pure-control-group">
				<input id="pass_field" class="pure-input-1 form-large" type="password" placeholder="Password">
			</div>
			<space></space>
			</form>			
			<button id="login" class="pure-button pure-button-primary button-large pure-u-5-5">Log in</button>
			<center><footer><a href="signup">Sign up</a>  <a href="forgot">Forgot Password?</a></footer></center>
        </div>
    </pep>
<script src="js/login.js"></script>
</body>
</html>
