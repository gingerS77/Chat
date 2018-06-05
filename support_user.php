<html>
<head>
<title>Support user Screen</title>
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet">
<style>
 .well{
    width: 100%;
    height: 300px;
    border: 1px solid black;
 }
</style>
</head>
<body>
<div class="container">
  <h2 style="text-align: center;">Support User Interface</h2>
  <div class="row">
    		<div class="col-md-12">
    		Connected User <span class="glyphicon glyphicon-signal"></span>:<span id="connected_user">None</span> 
    		</div>
  </div>
  <div class="row">
  	    <div class="col-md-6">
    	
        <h2>Chat Area</h2>
        <div class="well" style="">
          
        </div>
      <!--  <p>  -->
        <div class="input-group">
               <input type="text" class="form-control" id="message" disabled="disabled" />
               <button class="btn btn-default" id="send_btn" type="button">Send</button>
        </div>
      <!--  </p> -->
    </div>
    <div class="col-md-5">
      <h2>Users List</h2>
      <div class="well">
        <table class="table" id="users_list">
          <tr>
          	<td>User</td>
          	<td>Status</td>
          	<td>Timestamp</td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</div>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/pushfyi.js"></script>
<script type="text/javascript" src="js/actions.js"></script>
<script type="text/javascript">
	var pushfyi = new Pushfyi("d82d024e-ba9e-414d-9078-2d806ca5d155", "wss://sandbox.pushfyi.com", true);
	pushfyi.init();
	pushfyi.subscribe('hb_user_channel',function(event){
		alert(event);
	});
	//Support user arrived on page
	actions("JustArrived","SU",function(){});

	//getting actions of normal user
	var getAct = new getActions("NU");
		getAct.on("JustArrived",function(json){
			//write a logic here to get populated a new user in users list
		   	SU.showUsers(json.data,"users_list");
		});
</script>
</body>
</html>
