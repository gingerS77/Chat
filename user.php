
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/loose.dtd" >

<html>
<head>
<title>User interface</title>
<style>
body {
	background-color: #eeeeee;
	padding:0;
	margin:0 auto;
	font-family:"Lucida Grande",Verdana,Arial,"Bitstream Vera Sans",sans-serif;
	font-size:11px;
}
</style>

<link type="text/css" rel="stylesheet" media="all" href="css/chat.css" />
<link type="text/css" rel="stylesheet" media="all" href="css/screen.css" />

<!--[if lte IE 7]>
<link type="text/css" rel="stylesheet" media="all" href="css/screen_ie.css" />
<![endif]-->

</head>
<body>
<div id="main_container">

 <a href="javascript:void(0)" onclick="javascript:chatWith(userConfig.userId)">Open Chat Box</a>

</div>

<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/pushfyi.js"></script>
<script type="text/javascript">
	var pushfyi = new Pushfyi("d82d024e-ba9e-414d-9078-2d806ca5d155", "wss://sandbox.pushfyi.com", true);
		pushfyi.init();
/*
	Helpers 
*/
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}




	var userConfig = {
		"userId":guid(),
		"support_user_id":null,
		"gotSupportOfficerAssigned":false,
		"private_channel_name":null,
		"noSupportUserAssigned":true,
		"first_query_text":null,
		"sendChatMessage":function(private_channel_name,data,callback){
			pushfyi.publish(private_channel_name,{data:data});
			callback(data);
		},
		"getChatMessage":function(){

		}
	};
</script>
<script type="text/javascript" src="js/chat_modified.js"></script>
<script type="text/javascript" src="js/actions.js"></script>
<script type="text/javascript"> 
	

	//getting response from hb_bridge_channel to create private channel between user and support user
	pushfyi.subscribe('hb_bridge_channel',function(event){
		var json = JSON.parse(event);
			if (json.data.userId==userConfig.userId) {
				if (json.data.message == "want_to_help") {
					userConfig.gotSupportOfficerAssigned = true;
					userConfig.support_user_id = json.data.support_user_id;
					console.log(userConfig.support_user_id);
					userConfig.private_channel_name = userConfig.userId+"_"+userConfig.support_user_id+"_channel";
					//console.log(userConfig.private_channel_name);
						
				}
			}
	});








</script>

</body>
</html>