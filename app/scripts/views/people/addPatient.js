define(['backbone','jquery', 'underscore','vent','text!templates/addPatient.html'], function(Backbone,$,_,vent,template){

	var AddPatient = Backbone.View.extend({
		events: {
			'click #add-patient-button' : 'addPatient'
		},
		initialize: function(){
			this.template = _.template(template);
			this.$el.html(this.template({}));
			this.$('#firstname').val(this.model.get("firstName"));
			this.$('#lastname').val(this.model.get("lastName"));
		},
		render: function(){
			return this;
		},
		addPatient: function(ev){
			ev.preventDefault();
			this.model.set("firstName",this.$('#firstname').val());
			this.model.set("lastName",this.$('#lastname').val());

			this.model.save({},{success:function(){
				console.log('patient added successfully');
				vent.trigger('CDF.Views.People.AddPatient:addPatient:success');
			}});
			
		}

	});

	return AddPatient;
});