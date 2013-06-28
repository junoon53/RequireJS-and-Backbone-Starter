define(['backbone','jquery', 'underscore','vent','models/dentalMaterials/expendableInventoryItem','collections/dentalMaterials/expendableInventoryTypes'
	   ,'text!templates/addExpInventoryItem.html','text!templates/expendableInventoryTypesListRow.html'],
	    function(Backbone,$,_,vent,ExpendableInventoryItem,ExpendableInventoryTypes,template,expendableInventoryTypesListRowTemplate){

	var AddExpendableInventoryItem = Backbone.View.extend({
		model: new  ExpendableInventoryItem(),
		inventoryTypesCollection: new ExpendableInventoryTypes(),
		events: {
			'click #add-inventory-item-button' : 'addExpendableInventoryItem',
			'click .expendableInventoryTypesList li a': 'handleItemSelect',
		},
		initialize: function(){
			var self = this;
			this.template = _.template(template);
			this.expendableInventoryTypesListRowTemplate = _.template(expendableInventoryTypesListRowTemplate);
			this.inventoryTypesCollection.fetch({success: function(model,response,options){
				self.render();
			}});
		},
		close: function(){

		},
		render: function(){
			var self = this;
			this.$el.html(this.template({}));
			this.$('#genericName').val(this.model.get("genericName"));
			var expendableInventoryTypesList = "";
            _.each(this.inventoryTypesCollection.models,function(element,index,array){
                expendableInventoryTypesList += self.expendableInventoryTypesListRowTemplate({name:element.get('name'),type:element.get('_id')});
            });

            this.$('.expendableInventoryTypesList').html(expendableInventoryTypesList); 

            this.$('.expendableInventoryType').attr('id',0);
            var defaultValue = this.inventoryTypesCollection.findWhere({_id:0});
            this.$('.expendableInventoryType').text(defaultValue.get('name')); 
			return this;
		},
		addExpendableInventoryItem: function(ev){
			ev.preventDefault();
			var self = this;
			vent.trigger('CDF.Views.InventoryRequired.AddExpendableInventoryItem:addExpendableInventoryItem:called');
			this.model.set("genericName",this.$('#genericName').val());
			this.model.set("brandName",this.$('#brandName').val());
			this.model.set("accountingUnit",this.$('#accountingUnit').val());
			this.model.set("expendableInventoryType",this.$('.expendableInventoryType').attr('id'));

			this.model.save({},{success:function(model,response,options){
				console.log('Inventory  item added successfully');
				if(self.callback) self.callback(self.model);
				vent.trigger('CDF.Views.InventoryRequired.AddExpendableInventoryItem:addExpendableInventoryItem:success');

		    }});
			
		},
		handleItemSelect: function(ev){
			ev.preventDefault();
			var selectedExpendableInventoryType = parseInt(ev.currentTarget.id,10);
			this.model.set({expendableInventoryType:selectedExpendableInventoryType});
            this.$('.expendableInventoryType').attr('id',selectedExpendableInventoryType);
            this.$('.expendableInventoryType').text(this.inventoryTypesCollection.findWhere({_id:selectedExpendableInventoryType}).get('name'));  
		}

	});

	return AddExpendableInventoryItem;

});
