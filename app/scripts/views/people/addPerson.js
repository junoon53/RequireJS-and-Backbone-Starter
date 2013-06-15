define(['backbone','jquery', 'underscore','vent','models/people/person','text!templates/addPerson.html'], function(Backbone,$,_,vent,Person,template){

	var AddPerson = Backbone.View.extend({
		model: new Person(),
		events: {
			'click #add-person-button' : 'addPerson'
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
		addPerson: function(ev){
			var self = this;
			vent.trigger('CDF.Views.People.AddPerson:addPerson:called');
			ev.preventDefault();
			this.model.set("firstName",this.$('#firstname').val());
			this.model.set("lastName",this.$('#lastname').val());

			this.model.save({},{success:function(){
				console.log('person added successfully');
				if(self.callback) self.callback(self.model);
				vent.trigger('CDF.Views.People.AddPerson:addPerson:success');

		    }});
			
		}

	});

	return AddPerson;

});
