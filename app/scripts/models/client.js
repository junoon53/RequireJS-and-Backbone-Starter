define(['backbone','underscore','jquery','vent','models/people/roles','collections/revenue/paymentOptions','config','utility','localStorage'],
function(Backbone,_,$,vent,roles,paymentOptions,config,utility) {

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
	        utility.appendTextToMain('new client session started');
	        self.save();
	        if(callback) callback();
            vent.trigger('CDF.Client:authenticate:success');
	        self.getStaticData();
	        return true;

    	} else {
    		utility.appendTextToMain('client auth failed');
            vent.trigger('CDF.Client:authenticate:failed');
            if(callback) callback();
	       	return false;
	    }
		
		});
    },
    getStaticData: function() {
        roles().fetch({ data: { clientKey: this.get('clientKey') },'clientKey':this.get('clientKey'),success:function(model,response,option){
            utility.appendTextToMain('roles fetched successfully');
            paymentOptions().fetch({success:function()  {
                utility.appendTextToMain('payment options fetched successfully');
                vent.trigger('CDF.Client:getStaticData:success');

            },error:function(model,response,options){
                vent.trigger('CDF.Client:getStaticData:failed');
                utility.appendTextToMain('error fetching payment options');
            }})

        },error: function(model,error,option){
            utility.appendTextToMain('error fetching roles');
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