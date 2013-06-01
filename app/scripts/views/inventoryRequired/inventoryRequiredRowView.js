define([
	'backbone',
	'jquery',
	'underscore',
	'collections/dentalMaterials/expendableInventoryItems',
	'models/dentalMaterials/inventoryRequiredRow',
	'vent',
	'text!templates/inventoryRequiredRow.html',
	'bootstrap'	
	], function(Backbone,$,_,ExpendableInventoryItems,InventoryRequiredRow,vent,template){

	var InventoryRequiredRowView = Backbone.View.extend({
		model: new InventoryRequiredRow(),
		className: 'inventoryRequiredRow',
		events: {
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		expendableInventoryItemsMap:  {},
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
				case "genericName":
					//this.$('.genericName').removeAttr('readonly').focus();
					this.$('.genericName').attr("valueId", "null");	
					this.model.set("expendableInventoryItem","null",{silent:true});
					this.$('.genericName').val("");				
					break;
				case "qty":
					//this.$('.qty').removeAttr('readonly').focus();
					break;
			}
		
		},
		exitColumn: function(ev) {
			var element = null;
			var propertyName = ev.currentTarget.className.split(" ")[0];
			switch(propertyName){
				case "genericName":
					element = this.$('.genericName');
					setElementValue.call(this,'expendableInventoryItem');
					break;
				case "qty":
					this.model.set('qty', parseInt(this.$('.qty').attr("value"),10),{silent:true});
					vent.trigger('CDF.Views.InventoryRequired.InventoryRequiredRowView:exitColumn:qty');
					break;
			}

			function setElementValue(propertyId){

				if(element !== null){				
					this.model.set(propertyName, element.attr("value"),{silent:true});
							
						
					if(typeof propertyId !== "undefined"){
						var propertyValue = element.attr("valueId");
						if(propertyValue !== "null") {
							this.model.set(propertyId,parseInt(propertyValue,10),{silent:true});
						} else if(element.attr("value").trim().length > 0) this.whenValueIsNotSelected(propertyId,propertyName,element.attr("value"));
					}
				}
			};

		},
		whenValueIsNotSelected : function(propertyId,propertyName,value){
			
			switch(propertyId){
				case "expendableInventoryItem":
				    this.addNewExpendableInventoryItem(value);
					break;
			}
		},
		addNewExpendableInventoryItem: function(propertyName){
				vent.trigger('CDF.Views.InventoryRequired.InventoryRequiredRowView:addNewExpendableInventoryItem',{genericName:propertyName});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.exitColumn(ev);

				switch(ev.currentTarget.className.split(" ")[0]){
				case "genericName":
					_.delay(function() { self.$('.genericName').blur() }, 100);
					break;
				case "qty":
					_.delay(function() { self.$('.qty').blur() }, 100);
					break;
				}
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.InventoryRequired.InventoryRequiredRowView:delete');
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
					collection.fetch({data:{searchString:query},success: function(){
						var result = [];
						var data = collection.toJSON();								
						 _.each(data,function(element,index,data){
						 var name = element.genericName+" "+element.brandName+' # '+element._id;
							 result.push(name);
					     map[name] = {};
						 map[name].expendableInventoryItem = element._id;
						 map[name].accountingUnit = element.accountingUnit;
						 map[name].brandName = element.brandName;
						 map[name].expendableInventoryType = element.expendableInventoryType.name;
						});

						process(result);
					}});
			}

			};
			
			function updater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ].expendableInventoryItem );
			 	 $( "#"+this.options.brandNameId ).text( this.options.map[ item ].brandName );
			 	 $( "#"+this.options.accountingUnitId ).text( this.options.map[ item ].accountingUnit );
			 	 $( "#"+this.options.expendableInventoryTypeId ).text( this.options.map[ item ].expendableInventoryType );
				 return item;
		 
			};
			this.$('.genericName').typeahead({source:source(new ExpendableInventoryItems()),updater:updater,minLength:3,
				id:"expendableInventoryItem"+this.model.cid,
				brandNameId:"brandName"+this.model.cid,
				accountingUnitId:"accountingUnit"+this.model.cid,
				expendableInventoryTypeId:"expendableInventoryType"+this.model.cid,
				map:this.expendableInventoryItemsMap});
			return this;
		}
	
	});

	return InventoryRequiredRowView;

});