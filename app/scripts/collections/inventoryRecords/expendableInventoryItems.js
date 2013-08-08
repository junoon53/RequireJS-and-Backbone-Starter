define(['underscore','backbone','models/formModels/dentalMaterials/inventoryReceivedRow','vent','config','utility'], function(_,Backbone,Item,vent,config,utility) {

	var ExpendableInventoryItems = Backbone.Collection.extend({
		model: Item,
		url: config.serverUrl+'expendableInventoryRecords',
		initialize: function(){
		   var self = this;
           this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);
	    },
	    onClose: function(){

	    },
	    fetchItems: function(searchString,clinic,lastId,itemsPerPage) {
	    	this.fetch({data:{searchString:searchString,clinic:clinic,lastId:lastId,itemsPerPage:itemsPerPage},success: function(model, response, options){
                        
                if(response)
                    vent.trigger('Collections.InventoryRecords.ExpendableInventoryItems:fetchItems:success',response.totalResults);
                    
            },
        	remove:false});
	    },
	    comparator : function(item) {
		  	return item.get("_id");
		},
	    parse: function(response,options) {
	    	var result = [];
	    	var data = response.data;
	    	//var totalResults = ;
	    	data.forEach(function(item){

	    		for (var prop in item.expendableInventoryItem) {
	    			if(prop == "_id") continue;
	    			item[prop] = item.expendableInventoryItem[prop];
	    		}
	    		item.expendableInventoryType = item.expendableInventoryType.name;
	    		item.receivedBy = utility.toTitleCase(item.receivedBy.firstName+" "+item.receivedBy.lastName);
	    		//item.dateReceived = utility.getLongDate(new Date(item.dateReceived));
	    		//item.dateExpiry = utility.getLongDate(new Date(item.dateExpiry));
	    		result.push(item);
	    	});
	    	return result;
	    }
	});

	return ExpendableInventoryItems;

});	