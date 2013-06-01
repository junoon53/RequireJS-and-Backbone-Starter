define([
	'backbone',
	'jquery',
	'underscore',
	'collections/people/persons',
	'models/expenditure/expenditureRow',
	'vent',
	'text!templates/expenditureRow.html',
	'bootstrap',
	
	], function(Backbone,$,_,Persons,ExpenditureRow,vent,template){

	var ExpenditureRowView = Backbone.View.extend({
		//model: new ExpenditureRow(),
		className: 'expenditureRow',
		events: {
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
			'click ul.dropdown-menu li': 'updatePaymentType'					
		},
		receivedByMap:  {},
        sanctionedByMap:  {},
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
				case "receivedByName":
					//this.$('.removeAttr').receivedByName('readonly').focus();
					this.$('.receivedByName').attr("valueId", "null");
					this.model.set("receivedBy","null",{silent:true});
					this.$('.receivedByName').val("");
					break;
				case "sanctionedByName":
					//this.$('.sanctionedByName').removeAttr('readonly').focus();
					this.$('.sanctionedByName').attr("valueId", "null");	
					this.model.set("sanctionedBy","null",{silent:true});
					this.$('.sanctionedByName').val("");				
					break;
				case "amount":
					//this.$('.amount').removeAttr('readonly').focus();
					break;
				case "qty":
					//this.$('.qty').removeAttr('readonly', true).focus();
					break;
			}
		
		},
		exitColumn: function(ev) {
			var element = null;
			var propertyName = ev.currentTarget.className.split(" ")[0];
			switch(propertyName){
				case "item":
					this.model.set('item',this.$('.item').attr("value"),{silent:true});
					break;
				case "receivedByName":
					element = this.$('.receivedByName');
					setElementValue.call(this,'receivedBy');
					break;
				case "sanctionedByName":
					element = this.$('.sanctionedByName');
					setElementValue.call(this,'sanctionedBy');
					break;
				case "qty":
					this.model.set('qty',this.$('.qty').attr("value"),{silent:true});
					break;
				case "amount":
					this.model.set('amount',this.$('.amount').attr("value"),{silent:true});
					vent.trigger('CDF.Views.Expenditure.ExpenditureRowView:exitColumn:amount');
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
				case "receivedBy":
					this.addNewPerson(value);
					break;
				case "sanctionedBy":
					this.addNewPerson(value);
					break;
			}
		},
		addNewPerson: function(propertyName){
				vent.trigger('CDF.Views.Expenditure.ExpenditureRowView:addNewPerson',{receivedByNameString:propertyName});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.exitColumn(ev);

				switch(ev.currentTarget.className.split(" ")[0]){
				case "receivedByName":
					_.delay(function() { self.$('.receivedByName').blur() }, 100);
					break;
				case "sanctionedByName":
					_.delay(function() { self.$('.sanctionedByName').blur() }, 100);
					break;
				case "amount":
					_.delay(function() { self.$('.amount').blur() }, 100);
					break;
				case "qty":
					_.delay(function() { self.$('.qty').blur() }, 100);
					break;
				}
				
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.Expenditure.ExpenditureRowView:delete');			
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
			this.$('.receivedByName').typeahead({source:source(new Persons(),[1,2,3,4]),updater:updater,minLength:3,id:"receivedBy"+this.model.cid,map:this.receivedByMap});
			this.$('.sanctionedByName').typeahead({source:source(new Persons(),[1,2,3,4]),updater:updater,minLength:3,id:"sanctionedBy"+this.model.cid,map:this.sanctionedByMap});
			
			return this;
		}
	
	});

	return ExpenditureRowView;

});