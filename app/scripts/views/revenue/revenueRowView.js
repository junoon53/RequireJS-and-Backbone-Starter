define([
	'backbone',
	'jquery',
	'underscore',
	'collections/people/patients',
	'collections/people/doctors',
	'collections/revenue/paymentOptions',
	'models/revenue/revenueRow',
	'vent',
	'text!templates/revenueRow.html',
	'bootstrap',
	
	], function(Backbone,$,_,Patients,Doctors,PaymentOptions,RevenueRow,vent,template){

	var RevenueRowView = Backbone.View.extend({
		model: new RevenueRow(),
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
			this.listenTo(this.model,'remove',this.delete);
		},
		onClose: function(){
		},
		edit: function(ev) {
			ev.preventDefault();
			switch(ev.currentTarget.className.split(" ")[0]){
				case "patientName":
					//this.$('.removeAttr').patientName('readonly').focus();
					this.$('.patientName').attr("valueId", "null");
					this.model.set("patientId","null",{silent:true});
					this.$('.patientName').val("");
					break;
				case "doctorName":
					//this.$('.doctorName').removeAttr('readonly').focus();
					this.$('.doctorName').attr("valueId", "null");	
					this.model.set("doctorId","null",{silent:true});
					this.$('.doctorName').val("");				
					break;
				case "amount":
					//this.$('.amount').removeAttr('readonly').focus();
					break;
				case "paymentTypeName":
					//this.$('.paymentTypeName').removeAttr('readonly', true).focus();
					this.$('.paymentTypeName').attr("valueId", 0);
					this.model.set("paymentTypeId",0,{silent:true});	
					this.$('.paymentTypeName').val("");			
					break;
			}
		
		},
		exitColumn: function(ev) {
			var element = null;
			var propertyName = ev.currentTarget.className.split(" ")[0];
			switch(propertyName){
				case "patientName":
					element = this.$('.patientName');
					setElementValue.call(this,'patientId');
					break;
				case "doctorName":
					element = this.$('.doctorName');
					setElementValue.call(this,'doctorId');
					break;
				case "amount":
					element = this.$('.amount');
					setElementValue.call(this);
					vent.trigger('CDF.Views.Revenue.RevenueRowView:exitColumn:amount');
					break;
				case "paymentTypeName":
					element = this.$('.paymentTypeName');
					setElementValue.call(this,'paymentTypeId');
					break;
			}

			function setElementValue(propertyId){

				if(element !== null){				
					this.model.set(propertyName, element.attr("value"),{silent:true});
					if (false/*validate model*/) {
					 	element.addClass( 'input-validation-error' );
					 	//this.$('.revenueRow').tooltip({title:this.model.validationError,container:'.revenueRow',trigger:'hover'});
					 	//this.$('.patientName').tooltip('show');
						} else {
							element.removeClass( 'input-validation-error' );
							//element.tooltip('destroy');
						}					
						
					if(typeof propertyId !== "undefined"){
						var propertyValue = element.attr("valueId");
						if(propertyValue !== "null") {
							this.model.set(propertyId,propertyValue,{silent:true});
							//element.attr('readonly',true);
						} else if(element.attr("value").trim().length > 0) this.whenValueIsNotSelected(propertyId,element.attr("value"));
					}
												
					

				}
			};

		},
		whenValueIsNotSelected : function(propertyId,propertyName){
			
			switch(propertyId){
				case "patientId":
					this.addNewPatient(propertyName);
					break;
				case "doctorId":
					this.addNewDoctor(propertyName);
					break;
				case "paymentTypeId":
					break;
			}
		},
		addNewPatient: function(propertyName){
			//if(!CDF.isModalVisible){
				vent.trigger('CDF.Views.Revenue.RevenueRowView:addNewPatient',{patientNameString:propertyName});
			//}		
		},
		addNewDoctor: function(propertyName){
			//if(!CDF.isModalVisible){
				vent.trigger('CDF.Views.Revenue.RevenueRowView:addNewDoctor',{doctorNameString:propertyName});
			//}		
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
				case "paymentTypeName":
					_.delay(function() { self.$('.paymentTypeName').blur() }, 100);
					break;
				}
				
			}
		},
		updatePaymentType: function(ev){
			ev.preventDefault();
			switch(ev.currentTarget.id){
				case "0":		
					this.model.set("paymentTypeId",0);
					this.model.set("paymentTypeName","CASH");
					break;
				case "1":
					this.model.set("paymentTypeId",1);
					this.model.set("paymentTypeName","CARD");		
					break;
			}
			this.render();		
		},
		delete: function(ev) {
			ev.preventDefault();
			this.close();
		},	
		render: function() {
			this.model.set("rowId",this.model.cid,{silent:true});
			this.$el.html(this.template(this.model.toJSON()));

			this.$('ul.dropdown-menu').html('<li id="0"><a href="#">CASH</a></li><li id="1"><a href="#">CARD</a></li>');

			function source(collection) {

				return function(query,process){
					var map = this.options.map;
					collection.fetch({data:{q:query},success: function(){
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

			function paymentOptionsSource(collection) {

				return function(query,process){
					var map = this.options.map;
					collection.fetch({data:{q:query},success: function(){
						var result = [];
						var data = collection.toJSON();								
						 _.each(data,function(element,index,data){
						 var name = element.name;
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

			this.$('.patientName').typeahead({source:source(new Patients()),updater:updater,minLength:3,id:"patientId"+this.model.cid,map:this.patientMap});
			this.$('.doctorName').typeahead({source:source(new Doctors()),updater:updater,minLength:3,id:"doctorId"+this.model.cid,map:this.doctorsMap});
			this.$('.paymentTypeName').typeahead({source:paymentOptionsSource(new PaymentOptions()),updater:updater,minLength:3,id:"paymentTypeId"+this.model.cid,map:this.paymentOptionsMap});
			return this;
		}
	
	});

	return RevenueRowView;

});