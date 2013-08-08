var _instance = null;
var async = require('async');

function Inventory(schemata) {

	var self = this;

	this._addClinicExpendableInventoryItem = function(clinicExpendableInventoryItem,callback){
		schemata.ClinicExpendableInventory.count({},function(err,count){
			clinicExpendableInventoryItem._id = Math.floor(Math.random()*1000000000000)+count;
			clinicExpendableInventoryItem.save(function(err,data){
				schemata.ExpendableInventoryType.populate(data,{path:'expendableInventoryType'},
				function(err,data){
					schemata.Person.populate(data,{path:'receivedBy'},
					function(err,data){
						if(callback) callback(err,data);
					});
				});
				
			});
		});
	};

	this._updateClinicExpendableInventoryItem = function(attributes,callback){
		var _id = attributes._id;
		delete attributes._id;
		schemata.ClinicExpendableInventory.update(
			{_id:_id},
			attributes,
			{},
			function(err,numAffectedRows,rawResponse){
				if(err) console.log('error: '+err);
				if(callback) callback(err,numAffectedRows);
			}
		);
	};

	this._getExpendableInventoryItems = function(searchString,callback){
		schemata.ExpendableInventoryMaster.find({
					"genericName" : {$regex : ".*"+searchString.toUpperCase()+".*"}
					 })
			.populate('expendableInventoryType')
			.execFind(function(err,data){
				if(err) console.log(err);
				console.log(data);
				callback(data);
		});
	};

	this._searchExpendableInventoryItems = function(searchString,callback){
		schemata.ExpendableInventoryMaster.find({
					$or : [
						{"genericName" : {$regex : ".*"+searchString.toUpperCase()+".*"}},
						{"brandName" : {$regex : ".*"+searchString.toUpperCase()+".*"}},
					]
					
					 })
			.select('_id')			
			.execFind(function(err,data){
				if(err) console.log(err);
				//console.log(data);
				callback(data);
		});
	};



	this.getExpendableInventoryTypes = function(req,res,next){
		console.log('getting expendable inventory types...');
		res.header("Access-Control-Allow-Origin","*");		
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		schemata.ExpendableInventoryType.find().execFind(function(err,data){
		if(err) console.log(err)
			res.send(data);
		});
	};



	this.addClinicExpendableInventoryItem = function(req,res,next){

			console.log("adding expendable inventory item");
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");
		
		var clinicExpendableInventoryItem = new ClinicExpendableInventory({
	 		item : req.params.item,
			dateReceived : req.params.dateReceived,
			dateUpdated : req.params.dateUpdated,
			dateExpiry : req.params.dateExpiry,
			qtyReceived : req.params.qtyReceived,
			qtyRemaining : req.params.qtyRemaining,
			receivedBy : req.params.receivedBy,
			clinic : req.params.clinic
		});
		
		self._addClinicExpendableInventoryItem(clinicExpendableInventoryItem,function(err,data){
			console.log(err);
			console.log(data);
			res.send(data);
		});
	};

	this.getExpendableInventoryItems = function(req,res,next){
		console.log("sending expendable inventory items like :"+req.query.searchString);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		self._getExpendableInventoryItems(req.query.searchString,function(data){
			res.send(data);
		});

	};

	this.addExpendableInventoryItem = function(req,res,next){
		console.log("adding expendable inventory item..."+req.params.genericName);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		var expendableInventoryItem = new schemata.ExpendableInventoryMaster({
			genericName:req.params.genericName.toUpperCase(),
			brandName:req.params.brandName.toUpperCase(),
			accountingUnit:req.params.accountingUnit,
			expendableInventoryType:req.params.expendableInventoryType
		});

		schemata.ExpendableInventoryMaster.count({},function(err,count){
			expendableInventoryItem._id = Math.floor(Math.random()*10000)+count;
			expendableInventoryItem.save(function(err,data){
				schemata.ExpendableInventoryType.populate(data,{path:'expendableInventoryType'},
				function(err,data){
					console.log(err);
					console.log(data);
					res.send(data);
				});
				
			});
		});
	};

	this.getClinicExpendableInventoryRecords = function(req,res,next){
		console.log('sending expendable inventory records for clinic :'+req.query.clinic);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		var lastId = req.query.lastId;
		var itemsPerPage = req.query.itemsPerPage;
		var clinic = req.query.clinic;
		var searchString = req.query.searchString;
        var inventoryIds = [];
    	var result = {};
        	
        var getResults = function(inventory){

        	var searchOptions = {};
        	var countOptions = {};
        	if(clinic) {
        		searchOptions.clinic = clinic;
        		countOptions.clinic = clinic;
        	}
        	if(inventory) {
        		inventory.forEach(function(item){
        			inventoryIds.push(item._id);
        		});
        		//console.log(inventoryIds);
        		searchOptions.expendableInventoryItem = {$in: inventoryIds };
        		countOptions.expendableInventoryItem = {$in: inventoryIds };

        	}
        	searchOptions._id = {$gt: lastId};

        	schemata.ClinicExpendableInventory.find(searchOptions)
        	.sort({_id: 1})
			.limit(itemsPerPage)
        	.populate('expendableInventoryItem')
        	.populate('receivedBy')
        	.lean().execFind(function(err,data){
		       if(err) {
		          res.send(err);
		          return;
		       } else {
		       	  schemata.ExpendableInventoryType.populate(data, {path: 'expendableInventoryItem.expendableInventoryType'},function (err,data){
					if(err) {console.log(err); res.send(err);}
					else {
						schemata.ClinicExpendableInventory.count(countOptions,function(err, count){
							if(err) {console.log(err); res.send(err);}
							else {
								result.totalResults = count;
								result.data = data;
								res.send(result);
							}
						});

						
					}
		       	  });
		     }
		  });

        };

        self._searchExpendableInventoryItems(req.query.searchString,getResults);
        
	};

};



module.exports = function(schemata) {   
	if(!_instance) _instance = new Inventory(schemata);
	return _instance;
};