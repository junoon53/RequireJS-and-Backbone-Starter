define(['backbone','underscore','jquery','vent','models/client','config','cryptojs',"cryptojs-enc-utf16"], function(Backbone,_,$,vent,client,config) {

  var _instance = null;  

  var Auth = Backbone.Model.extend({
    
	url:config.serverUrl+'login',
	defaults:{
		loggedIn:false,
		username:"",
		password:"",
		person:null
	},
    initialize: function() {
        var self = this;
        this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick',this.logout);
        this.attempts = 0;
    },
    onClose: function(){
    },
    logout: function(){

        this.set('loggedIn',false);
        this.set('person',null);
    },
    login: function(){
        var self = this;
        this.attempts+=1;
        var user=  $("#username").val();
        var clientKey = client().get('clientKey').toString();
        var pword = $("#password").val();
        //var pword = GibberishAES.enc($("#password").val(),clientKey);
/*        Lpword = CryptoJS.AES.encrypt(pword, clientKey).toString(); 
        pword  = CryptoJS.enc.Utf8.parse(pword);
        pword = CryptoJS.enc.Hex.stringify(pword);
*/        
        this.save({username:user,password:pword,clientKey:clientKey},{
            success: function(model,response,options){
                if(response){  
                    vent.trigger('CDF.Models.Auth:login:success');
                } else {
                    alert("Invalid Credentials!");
                    if(self.attempts <= 3)
                        self.login();
                }
            },
            error: function(model,xhr,options){
                if(self.attempts <= 3)
                    self.login();
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