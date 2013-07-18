define(['backbone','underscore','jquery','utility','vent','config'], function(Backbone,_,$,utility,vent,config) {
    var _instance = null;

    var Graph = Backbone.Model.extend({
        url: '',
        defaults: {

        },
        initialize: function(){
           var self = this;
       
        },
        onClose: function(){

		}
    });

    return Graph;
});