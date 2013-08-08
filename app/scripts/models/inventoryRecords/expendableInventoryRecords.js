define(['backbone','underscore','jquery','vent','models/formModels/people/roles','config'], function(Backbone,_,$,vent,roles,config) {
    var _instance = null;

    var ExpendableInventoryRecords = Backbone.Model.extend({
        url: '',
        defaults: {
            clinic: null, 
            pgNo:1,
            lastId: 0,
            itemsPerPage:25,
            searchString:"",
            totalResults: 0
        },
        events: {

        },
        initialize: function(){
           var self = this;
        },
        onClose: function(){

        },
    });

    return ExpendableInventoryRecords;
});