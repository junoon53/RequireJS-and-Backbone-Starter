define(['backbone','underscore','jquery','vent'], function(Backbone,_,$,vent) {
    
  var Auth = Backbone.Model.extend({
    
	url:'http://192.168.211.132:8080/auth',
	defaults:{
		loggedIn:false,
		username:"",
		password:"",
		person:""
	},
    initialize: function() {
        var self = this;
        this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick',this.logout);
    },
    onClose: function(){
    },
    logout: function(){

        this.set('loggedIn',false);
    },
    login: function(){
        var self = this;
        var user=  $("#username").val();
        var pword = $("#password").val();
        this.save({username:user,password:pword},{
            success: function(model,response,options){
                if(response.length){
                    model.set({'loggedIn':true,
                               'person':response[0].person
                    });
                    vent.trigger('CDF.Models.Auth:login:success',model);
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

  return Auth;
});