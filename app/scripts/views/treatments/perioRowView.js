define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'collections/people/persons',
	'collections/treatments/treatments',

	'models/treatments/perioRow',

	'vent',
	'text!templates/perioRow.html',
	'text!templates/yesNo.html',
	'bootstrap',
	
	], function(Backbone,$,_,utility,Persons,Treatments,PerioRow,vent,template,yesNoTemplate){

	var PerioRowView = Backbone.View.extend({
		//model: new PerioRow(),
		className: 'perioRow row-fluid',
		events: {
			'click button.yesOption': 'addNewItem',
			'click button.noOption' : 'hidePopover',
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
			'change select.quadrant': 'updateQuadrant'					
		},
		patientMap:  {},
        doctorsMap:  {},
        treatmentsMap: {},
		initialize: function() {
			this.template = _.template(template);
			this.yesNoTemplate = _.template(yesNoTemplate);
			//this.listenTo(this.model,'remove',this.delete);
			this.listenTo(this.model,'validated:valid',this.onValid);
			this.listenTo(this.model,'validated:invalid',this.onInvalid);
			Backbone.Validation.bind(this);
		},
		onClose: function(){
		},
		updateQuadrant: function(ev){
			this.$('select.quadrant').attr('value',ev.currentTarget.value);
			this.model.set('quadrant',ev.currentTarget.value);
			this.model.isValid(true);
		},
		edit: function(ev) {
			ev.preventDefault();
			var targetClass = ev.currentTarget.className.split(" ")[0];
			var el = this.$('.'+targetClass);
			var valueId = el.attr('valueId');
			var value = el.val();
			if(el.attr('valueId') === 'null'
			&& el.val().length > 0 ) {
				this.whenValueIsNotSelected(targetClass,this.$('.'+targetClass).attr("value"));
			}
		},
		exitColumn: function(ev) {
			var targetClass = ev.currentTarget.className.split(" ")[0];
			switch(targetClass){
				case "patient":
					setModelProperties.call(this,'patient','patientName');
					break;
				case "doctor":
					setModelProperties.call(this,'doctor','doctorName');
					break;  
				case "treatment":
					setModelProperties.call(this,'treatment','treatmentName');
					break;  
				case "quadrant":
					this.model.set('quadrant',this.$('.quadrant').attr('value'));
					this.model.isValid(true);
					break;
				case "sitting":
					this.model.set(targetClass,parseInt(this.$('.sitting').attr('value'),10));
					this.model.isValid(true);
					break;
			}

			function setModelProperties(property,propertyName){
				this.model.set(propertyName, this.$('.'+property).attr("value"));							
				var propertyValue = this.$('.'+property).attr("valueId");
				if(propertyValue !== 'null') 
					this.model.set(property, parseInt(propertyValue,10));					
				this.model.isValid(true);	
			};

		},
		whenValueIsNotSelected : function(targetClass,value){			
			this.$("."+targetClass).tooltip('destroy');
			var yesNoTemplate = this.yesNoTemplate({message:'Add new '+targetClass+'?',id:targetClass});
			
			this.$("."+targetClass).popover({html: true, placement:'top',content:yesNoTemplate});
			this.$("."+targetClass).popover('show');
		},
		hidePopover: function(ev){
			ev.preventDefault();
			this.$('.'+ev.currentTarget.parentElement.id).popover('destroy');
		},
		addNewItem: function(ev){
			ev.preventDefault();
			var targetClass = ev.currentTarget.parentElement.id;
			this.$('.'+targetClass).popover('destroy');
			var value =  this.$('.'+targetClass).val();
			switch(targetClass){
				case "patient":
					this.addNewPatient(value);
					break;
				case "doctor":
					this.addNewDoctor(value);
					break;
				case "treatment":
					this.addNewTreatment(value);
					break;
			}
		},
		addNewPatient: function(propertyName){
				var self = this;
				function newPatientAdded(patientModel) {
					self.$('.patient').val(utility.toTitleCase(patientModel.get('firstName')+" "+patientModel.get('lastName')));
					self.$('.patient').attr('valueId',patientModel.get('_id'));
					self.model.set('patient',patientModel.get('_id'));
					self.model.set('patientName',patientModel.get('firstName')+" "+patientModel.get('lastName')); 
					self.model.isValid(true);
				}

				vent.trigger('CDF.Views.Treatments.PerioRowView:addNewPatient',{patientNameString:propertyName,callback:newPatientAdded});
		},
		addNewDoctor: function(propertyName){
			   var self = this;
				function newDoctorAdded(doctorModel) {
					self.$('.doctor').val(utility.toTitleCase(doctorModel.get('firstName')+" "+doctorModel.get('lastName')));
					self.$('.doctor').attr('valueId',doctorModel.get('_id'));
					self.model.set('doctor',doctorModel.get('_id'));
					self.model.set('doctorName',doctorModel.get('firstName')+" "+doctorModel.get('lastName')); 
					self.model.isValid(true);
				}
				vent.trigger('CDF.Views.Treatments.PerioRowView:addNewDoctor',{doctorNameString:propertyName,callback:newDoctorAdded});

		},
		addNewTreatment: function(propertyName){

		},
 		onEnterUpdate: function(ev) {
			if (ev.keyCode === 13) {
				this.edit(ev);
			} else {
				switch(ev.currentTarget.className.split(" ")[0]){
				case "patient":
					this.$('.patient').attr("valueId", "null");
					this.model.set("patient",null);
					break;
				case "doctor":
					this.$('.doctor').attr("valueId", "null");	
					this.model.set("doctor",null);
					break;
				case "treatment":
					this.$('.treatment').attr("valueId", "null");	
					this.model.set("treatment",null);
					break;
				case "expendableInventoryItem":
					this.$('.expendableInventoryItem').attr("valueId", "null");	
					this.model.set("expendableInventoryItem",null);
					break;
				}
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.Treatments.PerioRowView:delete');			
			this.close();
		},
		onValid: function(view,errors){
			var self = this;
			vent.trigger('CDF.Views.Treatments.PerioRowView:onValid');

			_.each(this.model.attributes,function(value,key){
				this.$('.'+key).popover('destroy');
				self.$("."+key).tooltip('destroy');
				self.$('.'+key).removeClass('input-validation-error');
			});
		},
		onInvalid: function(view,errors){
		    var self = this;
			_.each(this.model.attributes,function(value,key){
				self.$("."+key).tooltip('destroy');
				self.$('.'+key).removeClass('input-validation-error');
			});
			_.each(errors,function(value,key){
				self.$("."+key).tooltip({placement:'top',title:value,trigger:'focus hover'});
				self.$('.'+key).addClass('input-validation-error');
			});
		},
		render: function() {
			this.model.set("rowId",this.model.cid,{silent:true});
			this.$el.html(this.template(this.model.toJSON()));
			this.$('.quadrant').val(this.model.get('quadrant'));
			this.model.isValid(true);
			function personSource(collection,roles) {

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
			
			function personUpdater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ] );
				 return item;
		 
			};

			function treatmentsSource(collection,category) {

				return function(query,process){
					var map = this.options.map;
					collection.fetch({data:{searchString:query,category:category},success: function(){
						var result = [];
						var data = collection.toJSON();								
						 _.each(data,function(element,index,data){
						 var name = utility.toTitleCase(element.name);
							 result.push(name);
					     map[name] = element._id;
						});

						process(result);
					}});
			}
			};
			
			function treatmentsUpdater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ] );
				 return item;
		 
			};


			this.$('.patient').typeahead({source:personSource(new Persons(),[0]),updater:personUpdater,minLength:3,id:"patient"+this.model.cid,map:this.patientMap});
			this.$('.doctor').typeahead({source:personSource(new Persons(),[1,2]),updater:personUpdater,minLength:3,id:"doctor"+this.model.cid,map:this.doctorsMap});
			this.$('.treatment').typeahead({source:treatmentsSource(new Treatments(),1009),updater:treatmentsUpdater,minLength:3,id:"treatment"+this.model.cid,map:this.treatmentsMap});

			return this;
		}
	
	});

	return PerioRowView;

});