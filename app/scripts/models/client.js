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
            vent.trigger('CDF.Client:authenticate:success');
	        self.getStaticData();
	        return true;

    	} else {
    		console.log('client auth failed');
            vent.trigger('CDF.Client:authenticate:failed');
	       	return false;
	    }
		
		});
    },
    getStaticData: function() {
        roles().fetch({ data: { clientKey: this.get('clientKey') },'clientKey':this.get('clientKey'),success:function(model,response,option){
            console.log('roles fetched successfully');
            paymentOptions().fetch({success:function()  {
                console.log('payment options fetched successfully');
                vent.trigger('CDF.Client:getStaticData:success');

            },error:function(model,response,options){
                vent.trigger('CDF.Client:getStaticData:failed');
                console.log('error fetching payment options');
            }})

        },error: function(model,error,option){
            console.log('error fetching roles');
            vent.trigger('CDF.Client:getStaticData:failed');
        }});
    }
});

function getInstance() {
    if(_instance === null) _instance = new Client();
    return _instance
}

  return getInstance;

});