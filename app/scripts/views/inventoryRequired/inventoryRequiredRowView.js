define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'collections/dentalMaterials/expendableInventoryItems',
	'models/dentalMaterials/inventoryRequiredRow',
	'vent',
	'text!templates/inventoryRequiredRow.html',
	'text!templates/yesNo.html',
	'bootstrap'	
	], function(Backbone,$,_,utility,ExpendableInventoryItems,InventoryRequiredRow,vent,template,yesNoTemplate){

	var InventoryRequiredRowView = Backbone.View.extend({
		model: new InventoryRequiredRow(),
		className: 'inventoryRequiredRow row-fluid',
		events: {
			'click button.yesOption': 'addNewExpendableInventoryItem',
			'click button.noOption' : 'hidePopover',
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		expendableInventoryItemsMap:  {},
		initialize: function() {
			this.yesNoTemplate = _.template(yesNoTemplate);
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
			var element = null;
			var targetClass = ev.currentTarget.className.split(" ")[0];
			switch(targetClass){
				case "expendableInventoryItem":
					this.model.set(targetClass, this.$('.expendableInventoryItem').attr("value"));
					var propertyValue = this.$('.expendableInventoryItem').attr("valueId");
					if(propertyValue !== "null")
						this.model.set(targetClass,parseInt(propertyValue,10));
					this.model.isValid(true);
					break;
				case "qty":
					this.model.set('qty', parseInt(this.$('.qty').attr("value"),10));
					vent.trigger('CDF.Views.InventoryRequired.InventoryRequiredRowView:exitColumn:qty');
					this.model.isValid(true);
					break;
			}
		},
		whenValueIsNotSelected : function(targetClass,value){
			this.$("."+targetClass).tooltip('destroy');
			var yesNoTemplate = this.yesNoTemplate({message:'Add new '+targetClass+'?',id:targetClass});
			
			this.$("."+targetClass).popover({html: true, placement:'top',content:yesNoTemplate});
			this.$("."+targetClass).popover('show');
		},
		addNewExpendableInventoryItem: function(ev){
			ev.preventDefault();
			this.$('.expendableInventoryItem').popover('destroy');
			var value =  this.$('.expendableInventoryItem').val();
			var self = this;

				function newExpendableInventoryItemAdded(expendableInventoryItemModel) {
					self.$('.expendableInventoryItem').val(utility.toTitleCase(expendableInventoryItemModel.get('genericName')+" "+expendableInventoryItemModel.get('brandName')));
					self.$('.brandName').text(utility.toTitleCase(expendableInventoryItemModel.get('brandName')));
					self.$('.accountingUnit').text(utility.toTitleCase(expendableInventoryItemModel.get('accountingUnit')));
					self.$('.expendableInventoryType').text(utility.toTitleCase(expendableInventoryItemModel.get('expendableInventoryType').name));

					self.$('.expendableInventoryItem').attr('valueId',expendableInventoryItemModel.get('_id'));
					self.model.set('expendableInventoryItem',expendableInventoryItemModel.get('_id'));
					self.model.set('genericName',expendableInventoryItemModel.get('genericName'));
					self.model.set('brandName',expendableInventoryItemModel.get('brandName'));
					self.model.set('accountingUnit',expendableInventoryItemModel.get('accountingUnit'));
					self.model.set('expendableInventoryType',expendableInventoryItemModel.get('expendableInventoryType')._id);
					self.model.isValid(true);
				};

			vent.trigger('CDF.Views.InventoryRequired.InventoryRequiredRowView:addNewExpendableInventoryItem',{genericName:value,callback:newExpendableInventoryItemAdded});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.edit(ev);
			}else{
				switch(ev.currentTarget.className.split(" ")[0]){
					case "expendableInventoryItem":
						//this.$('.expendableInventoryItem').removeAttr('readonly').focus();
						this.$('.expendableInventoryItem').attr("valueId", "null");	
						this.model.set("expendableInventoryItem","null");
						//this.$('.expendableInventoryItem').val("");				
						break;
					case "qty":
						//this.$('.qty').removeAttr('readonly').focus();
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
			vent.trigger('CDF.Views.InventoryRequired.InventoryRequiredRowView:onValid');

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
			this.model.isValid(true);

			function source(collection,roles) {

				return function(query,process){
					var map = this.options.map;
					collection.fetch({data:{searchString:query},success: function(){
						var result = [];
						var data = collection.toJSON();								
						 _.each(data,function(element,index,data){
						 var name = utility.toTitleCase(element.genericName+" "+element.brandName)+' # '+element._id;
							 result.push(name);
					     map[name] = {};
						 map[name].expendableInventoryItem = element._id;
						 map[name].accountingUnit = utility.toTitleCase(element.accountingUnit);
						 map[name].brandName = utility.toTitleCase(element.brandName);
						 map[name].expendableInventoryType = utility.toTitleCase(element.expendableInventoryType.name);
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
			this.$('.expendableInventoryItem').typeahead({source:source(new ExpendableInventoryItems()),updater:updater,minLength:3,
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