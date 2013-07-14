define(['backbone','underscore','jquery','vent','models/formModels/people/roles','config'], function(Backbone,_,$,vent,roles,config) {
    var _instance = null;

    var IssueTracking = Backbone.Model.extend({
        url: '',
        defaults: {
            fromDate: new Date(),
            toDate: new Date(),
			clinic: null,  
			clinics: [],
            showCompleted: false,         
        },
        events: {

        },
        initialize: function(){
           var self = this;
           
        },
        onClose: function(){

        },
    });

    return IssueTracking;
});