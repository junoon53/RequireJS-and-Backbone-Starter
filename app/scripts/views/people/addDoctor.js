define(['backbone','jquery', 'underscore','vent','text!templates/addDoctor.html'], function(Backbone,$,_,vent,template){

	var AddDoctor = Backbone.View.extend({
		events: {
			'click #add-doctor-button' : 'addDoctor'
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
		addDoctor: function(ev){
			ev.preventDefault();
			this.model.set("firstName",this.$('#firstname').val());
			this.model.set("lastName",this.$('#lastname').val());

			this.model.save({},{success:function(){
				console.log('doctor added successfully');
				vent.trigger('CDF.Views.People.AddDoctor:addDoctor:success');

		    }});
			
		}

	});

	return AddDoctor;

});
