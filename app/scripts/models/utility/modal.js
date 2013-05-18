define(['backbone'], function(Backbone) {

	var Modal = Backbone.Model.extend({
	    defaults: function(){
	        return {
	            footer: "",
	            body: "",
	            header: ""
	        }     
	    },

	});

	return Modal;
});