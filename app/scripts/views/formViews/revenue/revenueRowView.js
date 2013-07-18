define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'collections/formCollections/people/persons',
	'collections/formCollections/revenue/paymentOptions',
	'models/formModels/revenue/revenueRow',
	'vent',
	'text!templates/revenueRow.html',
	'text!templates/yesNo.html',
	'bootstrap',
	
	], function(Backbone,$,_,utility,Persons,paymentOptions,RevenueRow,vent,template,yesNoTemplate){

	var RevenueRowView = Backbone.View.extend({
		//model: new RevenueRow(),
		className: 'revenueRow row-fluid',
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
        paymentOptionsMap:{},
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
				this.whenValueIsNotSelected(targetClass,this.$('.'+targetClass).val());
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
				case "amount":
					this.model.set(targetClass,parseInt(this.$('.amount').val(),10));
					this.model.isValid(true);
					vent.trigger('CDF.Views.Revenue.RevenueRowView:exitColumn:amount');
					break;
				case "consultantFee":
					this.model.set(targetClass,parseInt(this.$('.consultantFee').val(),10));
					this.model.isValid(true);
					vent.trigger('CDF.Views.Revenue.RevenueRowView:exitColumn:consultantFee');
					break;
				case "paymentOption":
					setModelProperties.call(this,'paymentOption','paymentOptionName');
					break;
			}

			function setModelProperties(property,propertyName){
				this.model.set(propertyName, this.$('.'+property).val());							
				var propertyValue = this.$('.'+property).attr("valueId");
				if(propertyValue !== 'null') 
					this.model.set(property, parseInt(propertyValue,10));					
				this.model.isValid(true);	
			};

		},
		whenValueIsNotSelected : function(targetClass,value){			
			this.$("."+targetClass).tooltip('destroy');
			this.$("."+targetClass).popover('destroy');
			var yesNoTemplate = this.yesNoTemplate({message:'Add new '+targetClass+'?',id:targetClass});
			
			this.$("."+targetClass).popover({html: true, placement:'top',content:yesNoTemplate,trigger:'click'});
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

				vent.trigger('CDF.Views.Revenue.RevenueRowView:addNewPatient',{patientNameString:propertyName,callback:newPatientAdded});
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
				vent.trigger('CDF.Views.Revenue.RevenueRowView:addNewDoctor',{doctorNameString:propertyName,callback:newDoctorAdded});

		},
 		onEnterUpdate: function(ev) {
			if (ev.keyCode === 13) {
				this.edit(ev);
			} else {
				switch(ev.currentTarget.className.split(" ")[0]){
				case "patient":
					this.$('.patient').attr("valueId", "null");
					this.model.set("patient",null);
					//this.$('.patientName').val("");
					break;
				case "doctor":
					this.$('.doctor').attr("valueId", "null");	
					this.model.set("doctor",null);
					//this.$('.doctorName').val("");				
					break;
				}
			}
		},
		updatePaymentType: function(ev){
			ev.preventDefault();
			switch(ev.currentTarget.id){
				case "0":		
					this.model.set("paymentOption",0);
					this.model.set("paymentOptionName","CASH");
					break;
				case "1":
					this.model.set("paymentOption",1);
					this.model.set("paymentOptionName","CARD");		
					break;
			}
			this.render();		
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.Revenue.RevenueRowView:delete');			
			this.close();
		},
		onValid: function(view,errors){
			var self = this;
			vent.trigger('CDF.Views.Revenue.RevenueRowView:onValid');

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
			function source(collection,roles) {

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
			
			function updater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ] );
				 return item;
		 
			};
			this.$('.patient').typeahead({source:source(new Persons(),[0]),updater:updater,minLength:3,id:"patient"+this.model.cid,map:this.patientMap});
			this.$('.doctor').typeahead({source:source(new Persons(),[1,2]),updater:updater,minLength:3,id:"doctor"+this.model.cid,map:this.doctorsMap});
			
			return this;
		}
	
	});

	return RevenueRowView;

});