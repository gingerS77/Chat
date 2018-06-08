
function log(anything){
	console.log(anything);
}

function guidd() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
/*
Params:

1.action:
2.userRole: there are 2 user roles - SU(Support User), NU(Normal User) 
*/

function actions(action,userRole,callback){
	var data;
	if (userRole == "NU") {
		if ( action == "JustArrived" ) {
				// new normal user just arrived on the page
				data = { "userId": userConfig.userId,"userRole":"NU","action":"JustArrived","timestamp":Date.now(),"status": "seeking","message":userConfig.first_query_text };
				pushfyi.publish('hb_user_channel',{data:data});	
				callback();//do additional tasks
		}
	}
	else if (userRole == "SU"){
		if ( action=="JustArrived" ) {
				// new support user just arrived on the page
				//nothin happens
		}
		else if ( action == "clickOnUser" ) {
			//Support clicks on user to help it 
			data = {"userId":SU.user_id_to_help,"support_user_id": SU.support_user_id,"userRole":"NU","action":"clickOnUser","message": "want_to_help" };
			pushfyi.publish('hb_bridge_channel',{data:data});
			callback();	
		}
	}
	
}


function getActions(userRole) {
	this.userRole = userRole;
}

getActions.prototype.on = function(action,callback) {
	if (this.userRole == "NU" ) {
		if (action == "JustArrived" ) {
			//subscribe to hb_user_channel to get the data about new user on support user page
			pushfyi.subscribe('hb_user_channel',function(event){
					console.log(event);
					callback(JSON.parse(event));
			});
		}	
	}
};


/*
Support_user helper functions
*/

var SU = {
	"support_user_id":guidd(),
	"subscribed_to_private_channel":false,
	"user_id_to_help":null,
	"private_channel_name":null,
	"first_query_text":null,
	"getChatMessage":function(private_channel_name,callback){
		pushfyi.subscribe(SU.private_channel_name,function(event){
			var json = JSON.parse(event);
			if (json.sender == 'NU') {
				callback(json);
			}
		});
	},
	"sendChatMessage":function(private_channel_name,data,callback){
		pushfyi.publish(private_channel_name,{data:data,sender:'SU'});
		callback(data);	
	}
};
	SU.showUsers = function(json,divId){
		var message = json.message;
	    var str = '';
	    var users_list = document.getElementById(divId);
	    str = "<td onclick=\"SU.helpUser('"+json.userId+"','"+json.message+"',this)\" id='"+json.userId+"' val='"+json.status+"'>"+json.userId+"</td>";
	    str+= "<td id='"+json.userId+"_status'>"+json.status+"</td>";
	    str+= "<td>"+json.timestamp+"</td>";
	    users_list.innerHTML+=str;
	}
	SU.helpUser = function(userId,message,thisObj){
		if(thisObj.getAttribute('val') != 'seeking') return;
		//user has seeked for help
	   //notify other support users about it 
	    var data = {'support_user_id':SU.support_user_id,'userId':thisObj.id,'status':'seeked'}; 
		pushfyi.publish('hb_support_channel',{data:data});
		SU.user_id_to_help = userId;
		document.getElementById('connected_user').innerHTML = SU.user_id_to_help;
		$("#message").removeAttr('disabled');
		SU.private_channel_name = SU.user_id_to_help+'_'+SU.support_user_id+'_channel';
		document.getElementById('chat_board').innerHTML = "<li>"+SU.user_id_to_help+": "+message+"</li>";
		actions("clickOnUser","SU",function(){
			document.getElementById('send_btn').addEventListener('click',function(){
				var data = {message:document.getElementById('message').value.trim(),timestamp:Date.now(),support_user_id:SU.support_user_id};
				if (data.message!='')
					SU.sendChatMessage(SU.private_channel_name,data,function(data){
						var li='';
						var ul = document.getElementById('chat_board');	
							li = "<li>me: "+data.message+"</li>";
							ul.innerHTML+= li;
						if (SU.subscribed_to_private_channel==false) {
							console.log("fff");
							SU.getChatMessage(SU.private_channel_name,function(json){
								var li = "<li>"+SU.user_id_to_help+": "+json.data+"</li>";
								var ul = document.getElementById('chat_board');	
									ul.innerHTML+= li;
							});
							SU.subscribed_to_private_channel = true;	
						}	
					});
			});
		});
	}








/*
Helper functions 
*/	
