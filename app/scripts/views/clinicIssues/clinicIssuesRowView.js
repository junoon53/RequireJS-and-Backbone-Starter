define([
	'backbone',
	'jquery',
	'underscore',
	'collections/people/persons',
	'models/clinicIssues/clinicIssuesRow',
	'vent',
	'text!templates/clinicIssuesRow.html',
	'bootstrap',
	
	], function(Backbone,$,_,Persons,ClinicIssues,vent,template){

	var ClinicIssuesRowView = Backbone.View.extend({
		//model: new ClinicIssues(),
		className: 'clinicIssuesRow',
		events: {
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		doctorsMap:  {},
		initialize: function() {
			this.template = _.template(template);
			//this.listenTo(this.model,'remove',this.delete);
			this.listenTo(this.model,'validated:valid',this.onValid);
			this.listenTo(this.model,'validated:invalid',this.onInvalid);
			Backbone.Validation.bind(this);
		},
		onClose: function(){
		},
		edit: function(ev) {
			ev.preventDefault();
			switch(ev.currentTarget.className.split(" ")[0]){
				case "doctorName":
					//this.$('.removeAttr').doctorName('readonly').focus();
					this.$('.doctorName').attr("valueId", "null");
					this.model.set("doctor","null",{silent:true});
					this.$('.doctorName').val("");
					break;
				case "issue":
					//this.$('.issue').removeAttr('readonly', true).focus();
					break;
			}
		
		},
		exitColumn: function(ev) {
			var element = null;
			var propertyName = ev.currentTarget.className.split(" ")[0];
			switch(propertyName){
				case "doctorName":
					element = this.$('.doctorName');
					setElementValue.call(this,'doctor');
					break;
				case "issue":
					this.model.set('issue',this.$('.issue').attr("value"),{silent:true});
					break;
			}

			function setElementValue(propertyId){				
				this.model.set(propertyName,element.attr("value"),{silent:true});
				if(typeof propertyId !== "undefined"){
					var propertyValue = element.attr("valueId");
					if(propertyValue !== "null") {
						this.model.set(propertyId, parseInt(propertyValue,10),{silent:true});
					} else if(element.attr("value").trim().length > 0) this.whenValueIsNotSelected(propertyId,propertyName,element.attr("value"));
				}
			};

		},
		whenValueIsNotSelected : function(propertyId,propertyName,value){
			
			switch(propertyId){
				case "doctor":
					this.addNewDoctor(value);
					break;
			}
		},
		addNewDoctor: function(propertyName){
				vent.trigger('CDF.Views.ClinicIssues.ClinicIssuesRowView:addNewDoctor',{doctorNameString:propertyName});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.exitColumn(ev);

				switch(ev.currentTarget.className.split(" ")[0]){
				case "doctorName":
					_.delay(function() { self.$('.doctorName').blur() }, 100);
					break;
				case "issue":
					_.delay(function() { self.$('.issue').blur() }, 100);
					break;
				}
				
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.ClinicIssues.ClinicIssuesRowView:delete');			
			this.close();
		},
		onValid: function(view,errors){
			var self = this;
			_.each(this.model.attributes,function(value,key){
				self.$("."+key).popover('destroy');
				self.$('.'+key).removeClass('input-validation-error');
			});
		},
		onInvalid: function(view,errors){
		    var self = this;
			_.each(this.model.attributes,function(value,key){
				self.$("."+key).popover('destroy');
				self.$('.'+key).removeClass('input-validation-error');
			});
			_.each(errors,function(value,key){
				self.$("."+key).popover({placement:'top',content:value,trigger:'focus hover'});
				self.$('.'+key).addClass('input-validation-error');
			});
		},
		render: function() {
			this.model.set("rowId",this.model.cid,{silent:true});
			this.$el.html(this.template(this.model.toJSON()));

			function source(collection,roles) {

				return function(query,process){
					var map = this.options.map;
					collection.fetch({data:{searchString:query,roles:roles},success: function(){
						var result = [];
						var data = collection.toJSON();								
						 _.each(data,function(element,index,data){
						 var name = element.firstName+" "+element.lastName+' # '+element._id;
							 result.push(name);
						 map[name] = (element._id);
						});

						process(result);
					}});
			}

			};
			
			function updater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ] );
				 return item;
		 
			};
			this.$('.doctorName').typeahead({source:source(new Persons(),[1,2]),updater:updater,minLength:3,id:"doctor"+this.model.cid,map:this.doctorsMap});
			return this;
		}
	
	});

	return ClinicIssuesRowView;

});