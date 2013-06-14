define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'collections/dentalMaterials/expendableInventoryItems',
	'collections/people/persons',
	'models/dentalMaterials/inventoryReceivedRow',
	'vent',
	'text!templates/inventoryReceivedRow.html',
	'text!templates/yesNo.html',
	'bootstrap',
	'datetimepicker'	
	], function(Backbone,$,_,utility,ExpendableInventoryItems,Persons,InventoryReceivedRow,vent,template,yesNoTemplate){

	var InventoryReceivedRowView = Backbone.View.extend({
		model: new InventoryReceivedRow(),
		className: 'inventoryReceivedRow row-fluid',
		events: {
			'click button.yesOption': 'addNewItem',
			'click button.noOption' : 'hidePopover',
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
            'changeDate #dateExpiry' : 'handleDateChange'
		},
		expendableInventoryItemsMap:  {},
		receivedByMap: {},
		initialize: function() {
			this.yesNoTemplate = _.template(yesNoTemplate);
			this.template = _.template(template);
			//this.listenTo(this.model,'remove',this.delete);
			this.listenTo(this.model,'validated:valid',this.onValid);
			this.listenTo(this.model,'validated:invalid',this.onInvalid);
			Backbone.Validation.bind(this);
		},
		onClose: function(){

            this.dateExpiry.destroy();

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
				case "receivedBy":
					this.model.set(targetClass, this.$('.'+targetClass).attr("value"));
					var propertyValue = this.$('.'+targetClass).attr("valueId");
					if(propertyValue !== "null")
						this.model.set(targetClass,parseInt(propertyValue,10));
					this.model.isValid(true);
					break;
				case "qtyReceived":
					this.model.set('qtyReceived', parseInt(this.$('.qtyReceived').attr("value"),10));
					vent.trigger('CDF.Views.InventoryReceived.InventoryReceivedRowView:exitColumn:qtyReceived');
					this.model.isValid(true);
					break;
			}
		},
        handleDateChange : function(ev) {
            ev.preventDefault();
            this.model.set("dateExpiry",ev.localDate);
			vent.trigger('CDF.Views.InventoryReceived.InventoryReceivedRowView:exitColumn:dateExpiry');
			this.model.isValid(true);
            this.dateExpiry.hide();
        }, 
		whenValueIsNotSelected : function(targetClass,value){
			this.$("."+targetClass).tooltip('destroy');
			var yesNoTemplate = this.yesNoTemplate({message:'Add new '+targetClass+'?',id:targetClass});
			
			this.$("."+targetClass).popover({html: true, placement:'top',content:yesNoTemplate});
			this.$("."+targetClass).popover('show');
		},
		addNewItem: function(ev) {
			ev.preventDefault();
			ev.preventDefault();
			var targetClass = ev.currentTarget.parentElement.id;
			this.$('.'+targetClass).popover('destroy');
			var value =  this.$('.'+targetClass).val();
			switch(targetClass){
				case 'expendableInventoryItem':
					this.addNewExpendableInventoryItem(value,targetClass);
					break;
				case 'receivedBy':
					this.addNewPerson(value,targetClass);
					break;
			}
		},
		addNewExpendableInventoryItem: function(value){
			this.$('.expendableInventoryItem').popover('destroy');
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

			vent.trigger('CDF.Views.InventoryReceived.InventoryReceivedRowView:addNewExpendableInventoryItem',{genericName:value,callback:newExpendableInventoryItemAdded});
		},
		addNewPerson: function(value){
			this.$('.'+targetClass).popover('destroy');
			var self = this;

				function newPersonAdded(personModel) {
					self.$('.'+targetClass).val(personModel.get('firstName')+" "+personModel.get('lastName'));
					self.$('.'+targetClass).attr('valueId',personModel.get('_id'));
					self.model.set(targetClass,personModel.get('_id'));
					self.model.set(targetClass+'Name',personModel.get('firstName')+" "+personModel.get('lastName')); 
					self.model.isValid(true);
				};
	
			vent.trigger('CDF.Views.InventoryReceived.InventoryReceivedRowView:addNewPerson',{personNameString:value,callback:newPersonAdded});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.edit(ev);
			}else{
				var targetClass = ev.currentTarget.className.split(" ")[0];
				switch(targetClass){
					case "expendableInventoryItem":
					case "receivedBy":
						this.$('.'+targetClass).attr("valueId", "null");	
						this.model.set(targetClass,"null");
						break;
					case "qtyReceived":
						//this.$('.qtyReceived').removeAttr('readonly').focus();
						break;
				}
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.InventoryReceived.InventoryReceivedRowView:delete');
			this.close();
		},	
		onValid: function(view,errors){
			var self = this;
			vent.trigger('CDF.Views.InventoryReceived.InventoryReceivedRowView:onValid');

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
            this.$('#dateExpiry').datetimepicker({
              pickTime: false
            });
            this.dateExpiry = this.$('#dateExpiry').data('datetimepicker');
            this.dateExpiry.setLocalDate(this.model.get("dateExpiry"));
			this.model.isValid(true);

			function expendableInventoryItemSource(collection,roles) {

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
						 map[name].accountingUnit = element.accountingUnit;
						 map[name].brandName = element.brandName;
						 map[name].expendableInventoryType = element.expendableInventoryType.name;
						});

						process(result);
					}});
			}

			};
			
			function expendableInventoryItemUpdater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ].expendableInventoryItem );
			 	 $( "#"+this.options.brandNameId ).text( this.options.map[ item ].brandName );
			 	 $( "#"+this.options.accountingUnitId ).text( this.options.map[ item ].accountingUnit );
			 	 $( "#"+this.options.expendableInventoryTypeId ).text( this.options.map[ item ].expendableInventoryType );
				 return item;
		 
			};

			function receivedBySource(collection,roles) {

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
			
			function receivedByUpdater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ] );
				 return item;
		 
			};

			this.$('.expendableInventoryItem').typeahead({
				source:expendableInventoryItemSource(new ExpendableInventoryItems()),
				updater:expendableInventoryItemUpdater,minLength:3,
				id:"expendableInventoryItem"+this.model.cid,
				brandNameId:"brandName"+this.model.cid,
				accountingUnitId:"accountingUnit"+this.model.cid,
				expendableInventoryTypeId:"expendableInventoryType"+this.model.cid,
				map:this.expendableInventoryItemsMap});
			this.$('.receivedBy').typeahead({
				source:receivedBySource(new Persons(),[1,2,3,4]),
				updater:receivedByUpdater,
				minLength:3,
				id:"receivedBy"+this.model.cid,
				map:this.receivedByMap});
			return this;
		}
	
	});

	return InventoryReceivedRowView;

});