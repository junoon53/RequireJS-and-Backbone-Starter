define([
	'backbone',
	'jquery',
	'underscore',
	'collections/people/persons',
	'collections/revenue/paymentOptions',
	'models/revenue/revenueRow',
	'vent',
	'text!templates/revenueRow.html',
	'bootstrap',
	
	], function(Backbone,$,_,Persons,paymentOptions,RevenueRow,vent,template){

	var RevenueRowView = Backbone.View.extend({
		//model: new RevenueRow(),
		className: 'revenueRow',
		events: {
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
				case "doctorName":
					//this.$('.doctorName').removeAttr('readonly').focus();
					this.$('.doctorName').attr("valueId", "null");	
					this.model.set("doctor","null",{silent:true});
					this.$('.doctorName').val("");				
					break;
				case "amount":
					//this.$('.amount').removeAttr('readonly').focus();
					break;
				case "paymentOption":
					//this.$('.paymentOption').removeAttr('readonly', true).focus();
					this.$('.paymentOption').attr("valueId", 0);
					this.model.set("paymentOption",0,{silent:true});	
					this.$('.paymentOption').val("");			
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
				case "doctorName":
					element = this.$('.doctorName');
					setElementValue.call(this,'doctor');
					break;
				case "amount":
					element = this.$('.amount');
					setElementValue.call(this);
					vent.trigger('CDF.Views.Revenue.RevenueRowView:exitColumn:amount');
					break;
				case "paymentOption":
					element = this.$('.paymentOptionName');
					setElementValue.call(this,'paymentOption');
					break;
			}

			function setElementValue(propertyId){

				if(element !== null){				
					this.model.set(propertyName, (propertyName === "amount") ? parseInt(element.attr('value'),10): element.attr("value"),{silent:true});								
						
					if(typeof propertyId !== "undefined"){
						var propertyValue = element.attr("valueId");
						if(propertyValue !== "null") {
							this.model.set(propertyId, parseInt(propertyValue,10),{silent:true});
						} else if(element.attr("value").trim().length > 0) this.whenValueIsNotSelected(propertyId,propertyName,element.attr("value"));
					}
				}
			};

		},
		whenValueIsNotSelected : function(propertyId,propertyName,value){
			
			switch(propertyId){
				case "patient":
					this.addNewPatient(value);
					break;
				case "doctor":
					this.addNewDoctor(value);
					break;
				case "paymentOption":
					break;
			}
		},
		addNewPatient: function(propertyName){
				vent.trigger('CDF.Views.Revenue.RevenueRowView:addNewPatient',{patientNameString:propertyName});
		},
		addNewDoctor: function(propertyName){
				vent.trigger('CDF.Views.Revenue.RevenueRowView:addNewDoctor',{doctorNameString:propertyName});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.exitColumn(ev);

				switch(ev.currentTarget.className.split(" ")[0]){
				case "patientName":
					_.delay(function() { self.$('.patientName').blur() }, 100);
					break;
				case "doctorName":
					_.delay(function() { self.$('.doctorName').blur() }, 100);
					break;
				case "amount":
					_.delay(function() { self.$('.amount').blur() }, 100);
					break;
				case "paymentOptionName":
					_.delay(function() { self.$('.paymentOptionName').blur() }, 100);
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

			this.$('ul.dropdown-menu').html('<li id="0"><a href="#">CASH</a></li><li id="1"><a href="#">CARD</a></li>');
			
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
			this.$('.patientName').typeahead({source:source(new Persons(),[0]),updater:updater,minLength:3,id:"patient"+this.model.cid,map:this.patientMap});
			this.$('.doctorName').typeahead({source:source(new Persons(),[1,2]),updater:updater,minLength:3,id:"doctor"+this.model.cid,map:this.doctorsMap});
			
			return this;
		}
	
	});

	return RevenueRowView;

});