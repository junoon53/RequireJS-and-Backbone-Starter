define([
	'backbone',
	'jquery',
	'underscore',
	'collections/people/persons',
	'models/patientsFeedback/patientsFeedbackRow',
	'vent',
	'text!templates/patientsFeedbackRow.html',
	'bootstrap',
	
	], function(Backbone,$,_,Persons,PatientsFeedback,vent,template){

	var PatientsFeedbackRowView = Backbone.View.extend({
		//model: new PatientsFeedback(),
		className: 'patientsFeedbackRow',
		events: {
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		patientsMap:  {},
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
				case "patientName":
					//this.$('.removeAttr').patientName('readonly').focus();
					this.$('.patientName').attr("valueId", "null");
					this.model.set("patient","null",{silent:true});
					this.$('.patientName').val("");
					break;
				case "feedback":
					//this.$('.feedback').removeAttr('readonly', true).focus();
					break;
			}
		
		},
		exitColumn: function(ev) {
			var element = null;
			var propertyName = ev.currentTarget.className.split(" ")[0];
			switch(propertyName){
				case "patientName":
					element = this.$('.patientName');
					setElementValue.call(this,'patient');
					break;
				case "feedback":
					this.model.set('feedback',this.$('.feedback').attr("value"),{silent:true});
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
				case "patient":
					this.addNewPatient(value);
					break;
			}
		},
		addNewPatient: function(propertyName){
				vent.trigger('CDF.Views.PatientsFeedback.PatientsFeedbackRowView:addNewPatient',{patientNameString:propertyName});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.exitColumn(ev);

				switch(ev.currentTarget.className.split(" ")[0]){
				case "patientName":
					_.delay(function() { self.$('.patientName').blur() }, 100);
					break;
				case "feedback":
					_.delay(function() { self.$('.feedback').blur() }, 100);
					break;
				}
				
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.PatientsFeedback.PatientsFeedbackRowView:delete');			
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
			this.$('.patientName').typeahead({source:source(new Persons(),[0]),updater:updater,minLength:3,id:"patient"+this.model.cid,map:this.patientsMap});
			return this;
		}
	
	});

	return PatientsFeedbackRowView;

});