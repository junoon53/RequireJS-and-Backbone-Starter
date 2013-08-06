define(['backbone','underscore','jquery','vent','models/formModels/people/roles','config'], function(Backbone,_,$,vent,roles,config) {
    var _instance = null;

    var Analytics = Backbone.Model.extend({
        url: '',
        defaults: {
			clinic: null,  
			clinics: [],
            fromDate: new Date(),
            toDate: new Date()
        },
        events: {

        },
        initialize: function(){
           var self = this;
        },
        onClose: function(){

        },
    });

    return Analytics;
});