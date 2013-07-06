define(['backbone','jquery', 'underscore','vent','models/formModels/people/person','text!templates/addPatient.html'], function(Backbone,$,_,vent,Person,template){

	var AddPatient = Backbone.View.extend({
		model: new Person(),
		events: {
			'click #add-patient-button' : 'addPatient'
		},
		initialize: function(){
			this.model = new Person();
			this.template = _.template(template);
		},
		render: function(){
			this.$el.html(this.template({}));
			this.$('#firstname').val(this.model.get("firstName"));
			this.$('#lastname').val(this.model.get("lastName"));
			return this;
		},
		addPatient: function(ev){
			var self = this;
			vent.trigger('CDF.Views.People.AddPatient:addPatient:called');
			ev.preventDefault();
			this.model.set("firstName",this.$('#firstname').val());
			this.model.set("lastName",this.$('#lastname').val());

			this.model.save({},{success:function(){
				console.log('patient added successfully');
				if(self.callback) self.callback(self.model);
				vent.trigger('CDF.Views.People.AddPatient:addPatient:success');
			}});
			
		}

	});

	return AddPatient;
});