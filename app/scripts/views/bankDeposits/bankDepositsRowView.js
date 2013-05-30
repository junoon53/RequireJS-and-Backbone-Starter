define([
	'backbone',
	'jquery',
	'underscore',
	'collections/people/persons',
	'models/bankDeposit/bankDepositRow',
	'vent',
	'text!templates/bankDepositsRow.html',
	'bootstrap'	
	], function(Backbone,$,_,Persons,BankDepositsRow,vent,template){

	var BankDepositsRowView = Backbone.View.extend({
		model: new BankDepositsRow(),
		className: 'bankDepositsRow',
		events: {
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		personsMap:  {},
		initialize: function() {
			this.template = _.template(template);
			this.listenTo(this.model,'remove',this.delete);
		},
		onClose: function(){
		},
		edit: function(ev) {
			ev.preventDefault();
			switch(ev.currentTarget.className.split(" ")[0]){
				case "personName":
					//this.$('.personName').removeAttr('readonly').focus();
					this.$('.personName').attr("valueId", "null");	
					this.model.set("person","null",{silent:true});
					this.$('.personName').val("");				
					break;
				case "amount":
					//this.$('.amount').removeAttr('readonly').focus();
					break;
			}
		
		},
		exitColumn: function(ev) {
			var element = null;
			var propertyName = ev.currentTarget.className.split(" ")[0];
			switch(propertyName){
				case "personName":
					element = this.$('.personName');
					setElementValue.call(this,'person');
					break;
				case "amount":
					element = this.$('.amount');
					setElementValue.call(this);
					vent.trigger('CDF.Views.BankDeposits.BankDepositsRowView:exitColumn:amount');
					break;
			}

			function setElementValue(propertyId){

				if(element !== null){				
					this.model.set(propertyName, element.attr("value"),{silent:true});
					if (false/*validate model*/) {
					 	element.addClass( 'input-validation-error' );
					 	//this.$('.bankDepositsRow').tooltip({title:this.model.validationError,container:'.bankDepositsRow',trigger:'hover'});
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
						} else if(element.attr("value").trim().length > 0) this.whenValueIsNotSelected(propertyId,propertyName,element.attr("value"));
					}
												
					

				}
			};

		},
		whenValueIsNotSelected : function(propertyId,propertyName,value){
			
			switch(propertyId){
				case "person":
				    this.$('.'+propertyName).attr('title','New Person? Click here to add');
				    this.$('.'+propertyName).tooltip({placement:'top',trigger:'hover'});
				    this.addNewPerson(value);
					personName;
					break;
			}
		},
		addNewPerson: function(propertyName){
			//if(!CDF.isModalVisible){
				vent.trigger('CDF.Views.BankDeposits.BankDepositsRowView:addNewPerson',{personNameString:propertyName});
			//}		
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.exitColumn(ev);

				switch(ev.currentTarget.className.split(" ")[0]){
				case "personName":
					_.delay(function() { self.$('.personName').blur() }, 100);
					break;
				case "amount":
					_.delay(function() { self.$('.amount').blur() }, 100);
					break;
				}
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			this.model.set('markedForDeletion',true);
			vent.trigger('CDF.Views.BankDeposits.BankDepositsRowView:delete');
			this.close();
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
			this.$('.personName').typeahead({source:source(new Persons(),[1,2,3,4]),updater:updater,minLength:3,id:"person"+this.model.cid,map:this.personsMap});
			return this;
		}
	
	});

	return BankDepositsRowView;

});