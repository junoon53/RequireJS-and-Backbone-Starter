define(['backbone','underscore','jquery','vent','config'], function(Backbone,_,$,vent,config) {
    var _instance = null;

    var Issue = Backbone.Model.extend({
        url: '',
        defaults: {
        	_id: null,
        	id: null,
        	reportId:null,
            date: new Date(),
            issue: new Date(),
			priority: 0,  
			status: 0,
			clinic: 0         
        },
        initialize: function(){
           var self = this;
           
        },
        onClose: function(){

        },
    });

    return Issue;
});