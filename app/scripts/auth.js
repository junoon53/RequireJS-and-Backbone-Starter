define(['backbone','underscore','jquery','vent','models/client','gibberish-aes'], function(Backbone,_,$,vent,client,GibberishAES) {

  var _instance = null;  

  var Auth = Backbone.Model.extend({
    
	url:'http://54.245.100.246:8080/login',
	defaults:{
		loggedIn:false,
		username:"",
		password:"",
		person:""
	},
    initialize: function() {
        var self = this;
        this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick',this.logout);
        GibberishAES.size(192);
    },
    onClose: function(){
    },
    logout: function(){

        this.set('loggedIn',false);
    },
    login: function(){
        var self = this;
        var user=  $("#username").val();
        var clientKey = client().get('clientKey').toString();
        GibberishAES.size(192);
        var pword = GibberishAES.enc($("#password").val(),clientKey);
        
        this.save({username:user,password:pword,clientKey:clientKey},{
            success: function(model,response,options){
                if(response){  
                    vent.trigger('CDF.Models.Auth:login:success');
                } else {
                    alert("Invalid Credentials!");
                }
            },
            error: function(model,xhr,options){

            }
        });
        return false;
    },
});

/*function getInstance() {
    if(_instance === null) _instance = new Auth();
    return _instance
}*/
  return Auth;

});