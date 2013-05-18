define(['vendor/backbone-amd/backbone'], function(Backbone){

	Backbone.View.prototype.close = function(){
	  this.remove();
	  this.off();
	  this.undelegateEvents();
	  this.stopListening();
	  this.model.off();
	  this.model.stopListening();

	  if (this.onClose){
	    this.onClose();
	    if(this.model.onClose){
	        this.model.onClose();
	    }
	  }
	};

  return Backbone;

});