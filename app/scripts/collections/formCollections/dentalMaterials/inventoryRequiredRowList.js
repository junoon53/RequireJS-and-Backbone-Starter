define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/formModels/dentalMaterials/inventoryRequiredRow',
	 'vent'
	 ], function(Backbone,$,_,utility,InventoryRequiredRow,vent){

	var InventoryRequiredRowList = Backbone.Collection.extend({
		model: InventoryRequiredRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);

	    },
	    onClose: function(){

	    },    
		filterInvalidRows: function(models){
			return _.reject(this.models,function(element){return !element.isValid()});
		},
		addDataFromReport: function(dataArray){
			var self = this;
			_.each(dataArray,function(element,index,array){
                self.add((new InventoryRequiredRow({
                	expendableInventoryItem: element.expendableInventoryItem._id,
                    genericName: utility.toTitleCase(element.expendableInventoryItem.genericName),
                    brandName: utility.toTitleCase(element.expendableInventoryItem.brandName),
                    accountingUnit: utility.toTitleCase(element.expendableInventoryItem.accountingUnit),
                    expendableInventoryType: utility.toTitleCase(element.expendableInventoryItem.expendableInventoryType.name),
                    qty: element.qty
                })));
            });
		},
		getDataForReport: function(){
			var result = [];
		    _.each(this.models,function(element,index,array){                    
               var dataMember = {
               		expendableInventoryItem: element.get('expendableInventoryItem'),
                    qty: element.get('qty')
                };
                result.push(dataMember);
            });
		 	return result;
		},
		isValid: function() {
			var result = true;
			_.each(this.models,function(element){

				if(!element.isValid(true)){
				    result = false;
				}
			});
			return result;
		}
		
	});

	return InventoryRequiredRowList;

});