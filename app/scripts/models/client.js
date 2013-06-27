define(['backbone','underscore','jquery','vent','models/people/roles','collections/revenue/paymentOptions','config','localStorage'],
function(Backbone,_,$,vent,roles,paymentOptions,config) {

var _instance = null;

var Client = Backbone.Model.extend({
    id:0,
    localStorage: new Backbone.LocalStorage('client'),
	defaults:{
		id:0,
		clientKey:null,
	},
    initialize: function() {
        var self = this;
    },
    onClose: function(){
    },
    authenticate: function(callback){
        var self = this;
        var clientKey = Math.floor((Math.random()*Math.pow(10,10))+1);
        this.set('clientKey',clientKey);
		$.get(config.serverUrl+'auth',{clientKey:clientKey},function(data){
    	if(data.result) {
	        // store key in local storage
	        console.log('new client session started');
	        self.save();
	        if(callback) callback();
	        self.getStaticData();
	        return true;

    	} else {
    		console.log('client auth failed');
	       	return false;
	    }
		
		});
    },
    getStaticData: function() {
        roles().fetch();
        paymentOptions().fetch();
    }
});

function getInstance() {
    if(_instance === null) _instance = new Client();
    return _instance
}

  return getInstance;

});