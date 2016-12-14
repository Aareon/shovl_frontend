<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
         <title>Shovl - Login</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/readable/bootstrap.min.css">
        <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
        <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/sweetalert2/4.0.9/sweetalert2.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <link rel="stylesheet" href="css/layouts/loginbox.css">
        <link rel="stylesheet" href="css/layouts/global.css">
    </head>
    <body>
			<!-- Start of login form -->
      <div id="login-container">
      <div class="panel panel-primary">
        <div class="panel-heading">Please Login</div>
        <div id="alertbox"></div>
        <div class="panel-body">
          <div class="form-group col-md-12">
            <input id="email_field" class="form-control input-md" type="email" placeholder="Email Address">
          </div>
          <div class="form-group col-md-12">
            <input id="pass_field" class="form-control input-md" type="password" placeholder="Password">
          </div>
          <div class="col-md-12">
            <button id="login" class="btn btn-primary btn-block">Log in</button>
          </div>
          <center><footer><a href="signup">Sign up |</a><a href="forgot"> Forgot Password?</a></footer></center>
        </div>
      </div>
    </div>
      <!-- End of login form -->

      <!-- Start of JS imports -->
      <script src="js/alertsystem.js"></script>
      <script src="js/login.js"></script>
      <!-- End of JS imports -->
    </body>
</html>
