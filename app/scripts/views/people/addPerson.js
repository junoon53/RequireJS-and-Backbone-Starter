define(['backbone','jquery', 'underscore','vent','text!templates/addPerson.html'], function(Backbone,$,_,vent,template){

	var AddPerson = Backbone.View.extend({
		events: {
			'click #add-person-button' : 'addPerson'
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
		addPerson: function(ev){
			vent.trigger('CDF.Views.People.AddPerson:addPerson:called');
			ev.preventDefault();
			this.model.set("firstName",this.$('#firstname').val());
			this.model.set("lastName",this.$('#lastname').val());

			this.model.save({},{success:function(){
				console.log('person added successfully');
				vent.trigger('CDF.Views.People.AddPerson:addPerson:success');

		    }});
			
		}

	});

	return AddPerson;

});
