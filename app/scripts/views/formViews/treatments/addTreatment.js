define(['backbone','jquery', 'underscore','models/formModels/treatments/treatment','vent','text!templates/addTreatment.html'],
 function(Backbone,$,_,Treatment,vent,template){

	var AddTreatment = Backbone.View.extend({
		events: {
			'click #add-treatment-button' : 'addTreatment'
		},
		initialize: function(){
			this.model = new Treatment();
			this.template = _.template(template);
		},
		render: function(){
			this.$el.html(this.template({}));
			this.$('#name').val(this.model.get('name'));
			return this;
		},
		addTreatment: function(ev){
			ev.preventDefault();
			var self = this;
			vent.trigger('CDF.Views.Treatments.AddTreatment:addTreatment:called');

			this.model.save({},{success: function(model,response,options){
							console.log('Treatment  added successfully');
							if(self.callback) self.callback(self.model);
							vent.trigger('CDF.Views.Treatments.AddTreatment:addTreatment:success');
			
					    }});
		}

	});

	return AddTreatment;

});
