define(['backbone','underscore','jquery','vent','models/formModels/people/roles','config'], function(Backbone,_,$,vent,roles,config) {
    var _instance = null;

    var Application = Backbone.Model.extend({
        url: '',
        defaults: {
            date: new Date(),
            // User properties
            user:null,
            role: "",
           

            // Properties for display
            userFullname: "",            
            
        },
        viewTypes: function() {
            return ['feedbackForm','issueTracking','analytics','expendableInventoryRecords'];
        },
        events: {
            //'change:date' : 'checkReportStatus'
        },
        initialize: function(){
           var self = this;
           
        },
        onClose: function(){

        },
    });

    return Application;
});