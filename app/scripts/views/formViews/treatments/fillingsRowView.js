define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'collections/formCollections/people/persons',
	'collections/formCollections/treatments/treatments',
	'collections/formCollections/dentalMaterials/expendableInventoryItems',

	'models/formModels/treatments/fillingsRow',

	'vent',
	'text!templates/fillingsRow.html',
	'text!templates/yesNo.html',
	'bootstrap',
	
	], function(Backbone,$,_,utility,Persons,Treatments,ExpendableInventoryItems,FillingsRow,vent,template,yesNoTemplate){

	var FillingsRowView = Backbone.View.extend({
		//model: new FillingsRow(),
		className: 'fillingsRow row-fluid',
		events: {
			'click button.yesOption': 'addNewItem',
			'click button.noOption' : 'hidePopover',
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
			'click ul.dropdown-menu li': 'updatePaymentType'					
		},
		patientMap:  {},
        doctorsMap:  {},
        treatmentsMap: {},
		expendableInventoryItemsMap:  {},
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
				case "expendableInventoryItem":
					setModelProperties.call(this,'expendableInventoryItem','genericName');
					break;  
				case "tooth":
					this.model.set(targetClass,parseInt(this.$('.tooth').attr('value'),10));
					this.model.isValid(true);
					break;
				case "numFillings":
					this.model.set(targetClass,parseInt(this.$('.numFillings').attr('value'),10));
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
			this.$("."+targetClass).popover('destroy');
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
				case "expendableInventoryItem":
					this.addNewExpendableInventoryItem(value);
					break;
			}
		},
		addNewExpendableInventoryItem: function(value){
			this.$('.expendableInventoryItem').popover('destroy');
			var value =  this.$('.expendableInventoryItem').val();
			var self = this;

				function newExpendableInventoryItemAdded(expendableInventoryItemModel) {
					self.$('.expendableInventoryItem').val(expendableInventoryItemModel.get('genericName')+" "+expendableInventoryItemModel.get('brandName'));
					self.$('.brandName').text(expendableInventoryItemModel.get('brandName'));
					self.$('.accountingUnit').text(expendableInventoryItemModel.get('accountingUnit'));
					self.$('.expendableInventoryType').text(expendableInventoryItemModel.get('expendableInventoryType').name);

					self.$('.expendableInventoryItem').attr('valueId',expendableInventoryItemModel.get('_id'));
					self.model.set('expendableInventoryItem',expendableInventoryItemModel.get('_id'));
					self.model.set('genericName',expendableInventoryItemModel.get('genericName'));
					self.model.set('brandName',expendableInventoryItemModel.get('brandName'));
					self.model.set('accountingUnit',expendableInventoryItemModel.get('accountingUnit'));
					self.model.set('expendableInventoryType',expendableInventoryItemModel.get('expendableInventoryType')._id);
					self.model.isValid(true);
				};

			vent.trigger('CDF.Views.Treatments.FillingsRowView:addNewExpendableInventoryItem',{genericName:value,callback:newExpendableInventoryItemAdded});
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

				vent.trigger('CDF.Views.Treatments.FillingsRowView:addNewPatient',{patientNameString:propertyName,callback:newPatientAdded});
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
				vent.trigger('CDF.Views.Treatments.FillingsRowView:addNewDoctor',{doctorNameString:propertyName,callback:newDoctorAdded});

		},
		addNewTreatment: function(propertyName){
			   var self = this;
				function newTreatmentAdded(treatmentModel) {
					self.$('.treatmentName').val(utility.toTitleCase(treatmentModel.get('name')));
					self.$('.treatment').attr('valueId',treatmentModel.get('_id'));
					self.model.set('treatmentName',treatmentModel.get('name')); 
					self.model.set('treatment',treatmentModel.get('_id')); 
					self.model.isValid(true);
				}
     			vent.trigger('CDF.Views.Treatments.FillingsRowView:addNewTreatment',{name:propertyName,category:1003,callback:newTreatmentAdded});
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
			vent.trigger('CDF.Views.Treatments.FillingsRowView:delete');			
			this.close();
		},
		onValid: function(view,errors){
			var self = this;
			vent.trigger('CDF.Views.Treatments.FillingsRowView:onValid');

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

			this.$('ul.dropdown-menu').html('<li id="0"><a href="#">CASH</a></li><li id="1"><a href="#">CARD</a></li>');
			this.model.isValid(true);
			function personSource(collection,roles) {

				return function(query,process){
					var map = this.options.map;
					collection.fetch({data:{searchString:query,roles:roles},success: function(){
						var result = [];
						var data = collection.toJSON();								
						 _.each(data,function(element,index,data){
						 var name = utility.toTitleCase(element.firstName+" "+element.lastName)+' # '+element._id;
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

			function expendableInventoryItemsSource(collection,roles) {

				return function(query,process){
					var map = this.options.map;
					collection.fetch({data:{searchString:query},success: function(){
						var result = [];
						var data = collection.toJSON();								
						 _.each(data,function(element,index,data){
						 var name = utility.toTitleCase(element.genericName+" "+element.brandName)+' # '+element._id;
							 result.push(name);
					     map[name] = element._id;
						});

						process(result);
					}});
			}

			};
			
			function expendableInventoryItemsUpdater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ] );
				 return item;
		 
			};


			this.$('.patient').typeahead({source:personSource(new Persons(),[0]),updater:personUpdater,minLength:3,id:"patient"+this.model.cid,map:this.patientMap});
			this.$('.doctor').typeahead({source:personSource(new Persons(),[1,2]),updater:personUpdater,minLength:3,id:"doctor"+this.model.cid,map:this.doctorsMap});
			this.$('.treatment').typeahead({source:treatmentsSource(new Treatments(),1003),updater:treatmentsUpdater,minLength:3,id:"treatment"+this.model.cid,map:this.treatmentsMap});
			this.$('.expendableInventoryItem').typeahead({source:expendableInventoryItemsSource(new ExpendableInventoryItems()),updater:expendableInventoryItemsUpdater,minLength:3,
				id:"expendableInventoryItem"+this.model.cid,
				map:this.expendableInventoryItemsMap});

			return this;
		}
	
	});

	return FillingsRowView;

});