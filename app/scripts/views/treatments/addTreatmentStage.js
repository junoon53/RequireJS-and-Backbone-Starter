define(['backbone','jquery', 'underscore','models/treatments/treatmentStage','vent','text!templates/addTreatmentStage.html'],
 function(Backbone,$,_,TreatmentStage,vent,template){

	var AddTreatmentStage = Backbone.View.extend({
		events: {
			'click #add-treatmentStage-button' : 'addTreatmentStage'
		},
		initialize: function(){
			this.model = new TreatmentStage();
			this.template = _.template(template);
		},
		render: function(){
			this.$el.html(this.template({}));
			this.$('#name').val(this.model.get('stageName'));
			return this;
		},
		addTreatmentStage: function(ev){
			ev.preventDefault();
			var self = this;
			vent.trigger('CDF.Views.Treatments.AddTreatmentStage:addTreatmentStage:called');

			this.model.save({},{success: function(model,response,options){
							console.log('Treatment stage added successfully');
							if(self.callback) self.callback(self.model);
							vent.trigger('CDF.Views.Treatments.AddTreatmentStage:addTreatmentStage:success');
			
					    }});
			
		}

	});

	return AddTreatmentStage;

});
