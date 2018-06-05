
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
				data = { "userId": userConfig.userId,"userRole":"NU","action":"JustArrived","timestamp":Date.now(),"status": "seeking_help","message":userConfig.first_query_text };
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
	"support_user_id":123,
	"user_id_to_help":null,
	"private_channel_name":null,
	"getChatMessage":function(){

	},
	"sendChatMessage":function(private_channel_name,data){
		pushfyi.publish(private_channel_name,{data:data});
	}
};
	SU.showUsers = function(json,divId){
	    var str = '';
	    var users_list = document.getElementById(divId);
	    str = "<td onclick=\"SU.helpUser('"+json.userId+"')\">"+json.userId+"</td>";
	    str+= "<td>"+json.status+"</td>";
	    str+= "<td>"+json.timestamp+"</td>";
	    users_list.innerHTML+=str;
	}
	SU.helpUser = function(userId){
		SU.user_id_to_help = userId;
		document.getElementById('connected_user').innerHTML = SU.user_id_to_help;
		$("#message").removeAttr('disabled');
		SU.private_channel_name = SU.user_id_to_help+'_'+SU.support_user_id+'_channel';
		actions("clickOnUser","SU",function(){
			document.getElementById('send_btn').addEventListener('click',function(){
				var data = {message:document.getElementById('message').value.trim(),timestamp:Date.now()};
				if (data.message!='')
					SU.sendChatMessage(SU.private_channel_name);
			});
		});
	}








/*
Helper functions 
*/	
