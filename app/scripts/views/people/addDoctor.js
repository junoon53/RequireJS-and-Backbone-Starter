define(['backbone','jquery', 'underscore','vent','models/people/person','text!templates/addDoctor.html'], function(Backbone,$,_,vent,Person,template){

	var AddDoctor = Backbone.View.extend({
		model: new Person(),
		events: {
			'click #add-doctor-button' : 'addDoctor'
		},
		initialize: function(){
			this.template = _.template(template);
		},
		render: function(){
			this.$el.html(this.template({}));
			this.$('#firstname').val(this.model.get("firstName"));
			this.$('#lastname').val(this.model.get("lastName"));
			return this;
		},
		addDoctor: function(ev){
			var self = this;
			vent.trigger('CDF.Views.People.AddDoctor:addDoctor:called');
			ev.preventDefault();
			this.model.set("firstName",this.$('#firstname').val());
			this.model.set("lastName",this.$('#lastname').val());

			this.model.save({},{success:function(){
				console.log('doctor added successfully');
				if(self.callback) self.callback(self.model);
				vent.trigger('CDF.Views.People.AddDoctor:addDoctor:success');

		    }});
			
		}

	});

	return AddDoctor;

});
