var _instance = null;

function Report(schemata) {
    
	var Inventory = require('./inventory.js')(schemata);
	var self = this;

	function _addReport(data,callback){
		var report = new schemata.Report({
			submitted: data.submitted,
			date : data.date,
			clinic : data.clinic,
			person : data.person,
			revenue : data.revenue,
			bankDeposits : data.bankDeposits,
			expenditure : data.expenditure,
			patientsFeedback : data.patientsFeedback,
			clinicIssues : data.clinicIssues,
			inventoryRequired : data.inventoryRequired,
			inventoryReceived : data.inventoryReceived,
			treatments: data.treatments
		});
		report.save(function(err,data){
				callback(err,data);
			});
	};

	

	

	function _getReport(req,callback){
		var startDate = new Date(req.query.date);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);
		console.log(startDate);
		var endDate = new Date(startDate.getTime());
		endDate.setHours(24);
		console.log(endDate);

		var clinic = parseInt(req.query.clinic,0);
		console.log(clinic);

		schemata.Report.find({date:{$gte: startDate, $lt: endDate},clinic:clinic})
	    .populate('person')
	    .populate('revenue.doctor')
	    .populate('revenue.patient')
	    .populate('revenue.paymentOption')
	    .populate('bankDeposits.person')
	    .populate('expenditure.sanctionedBy')
	    .populate('expenditure.receivedBy')
	    .populate('patientsFeedback.patient')
	    .populate('clinicIssues.doctor')
	    .populate('inventoryRequired.expendableInventoryItem')
	    .populate('inventoryReceived')
	    .populate('treatments.treatment')
	    .populate('treatments.doctors')
	    .populate('treatments.patient')
	    .execFind(function(err,data){
			if(err) {console.log(err); res.send(err);}
			else {
				schemata.ExpendableInventoryMaster.populate(data,{path:'inventoryReceived.expendableInventoryItem'},function (err,data){
					if(err) {console.log(err); res.send(err);}
				 	else {
				 		schemata.Person.populate(data,{path:'inventoryReceived.receivedBy'},function (err,data) {
							if(err) {console.log(err); res.send(err);}
							else {
								schemata.ExpendableInventoryType.populate(data, {path: 'inventoryRequired.expendableInventoryItem.expendableInventoryType'},function (err,data){
									if(err) {console.log(err); res.send(err);}
									else {
										schemata.ExpendableInventoryType.populate(data, {path: 'inventoryReceived.expendableInventoryItem.expendableInventoryType'},function (err,data){
							     			if(err) {console.log(err); res.send(err);}
							     			else {
							     				schemata.ExpendableInventoryMaster.populate(data,{path: 'treatments.details.expendableInventoryItem'}, function (err,data){
							     					if(err) {console.log(err); res.send(err);}
								     				else {
								     					schemata.TreatmentCategory.populate(data,{path: 'treatments.treatment.category'}, function (err,data){
									     					if(err) {console.log(err); res.send(err);}
										     				else {
											     				console.log(data);
																callback(data[0]);
										     				}
								     					});
								     				}
							     				});
							     			}
						     			});
									}
				     			});	
							}
				 		});
				 	}
				});
			}
		});
	};



	this.getReport  = function (req,res,next){
		console.log('getting report for date: '+ req.query.date);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		_getReport(req,function(data){
			res.send(data);
		});

	};

	
	this.checkReportStatus = function (req,res,next){
		console.log('checking report status...');
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");
		self._checkReportStatus(req.query.date,req.query.clinic,function(result){
			res.send(result);
		});

	};

	this._checkReportStatus = function(date,clinic, callback){
		var startDate = new Date(date);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);
		console.log(startDate);
		var endDate = new Date(startDate.getTime());
		endDate.setHours(24);
		console.log(endDate);

		var clinic = parseInt(clinic,0);
		console.log(clinic);

		schemata.Report.find({date:{$gte: startDate, $lt: endDate},clinic:clinic})
		.execFind(function(err,data){
			if(err) {console.log(err); res.send(err);}
			else if(data.length > 0) {
				callback({reportExists:true});
			} else {
				callback({reportExists:false});
			}
		});
	};


	this.addReport = function (req,res,next){
		console.log('saving report for date: '+ req.params.date);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");
		
		self._checkReportStatus(req.params.date,req.params.clinic,function(result){

			if(!result.reportExists){
				var clinicExpendableInventoryItems = [];

				if(req.params.inventoryReceived.length){
				 	req.params.inventoryReceived.forEach(function(item,index,array) {
				 		var inventoryReceived = new schemata.ClinicExpendableInventory({
							expendableInventoryItem : item.expendableInventoryItem,
							dateReceived : req.params.date,
							dateUpdated : req.params.date,
							dateExpiry : item.dateExpiry,
							qtyReceived : item.qtyReceived,
							qtyRemaining : item.qtyReceived,
							receivedBy : item.receivedBy,
							clinic : req.params.clinic
						});

				 		Inventory._addClinicExpendableInventoryItem(inventoryReceived,function(err,data){
				 			if(err){console.log(err);}
							clinicExpendableInventoryItems.push(data._id);

							if(index === array.length -1) {
								req.params.inventoryReceived = clinicExpendableInventoryItems;
							 	console.log(req.params.inventoryReceived);

								_addReport(req.params,function(err,data){
									if(err){
										console.log(err);
										res.send(err);
									} else if(data){
										res.send(data);
									}
								});
							}
						});
				 	});
				 } else {
				 	_addReport(req.params,function(err,data){
									if(err){
										console.log(err);
										res.send(err);
									} else if(data){
										res.send(data);
									}
							});
				 }

			} else {	
				res.send({message:'report exists for this date'});
			}
		});
	};

	this.updateReport = function (req,res,next){
		console.log('updating report with Id : '+ req.params._id);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		var clinicExpendableInventoryItems = [];

		if(req.params.inventoryReceived.length){
		req.params.inventoryReceived.forEach(function(item,index,array){
			if(item._id) {
				clinicExpendableInventoryItems.push(item._id);
				Inventory._updateClinicExpendableInventoryItem(item,function (err,data){
					if(err){console.log(err);}
					_updateReport(index,array);
				});
			} else {
				var inventoryReceived = new schemata.ClinicExpendableInventory({
					expendableInventoryItem : item.expendableInventoryItem,
					dateReceived : req.params.date,
					dateUpdated : req.params.date,
					dateExpiry : item.dateExpiry,
					qtyReceived : item.qtyReceived,
					qtyRemaining : item.qtyReceived,
					receivedBy : item.receivedBy,
					clinic : req.params.clinic
				});
				Inventory._addClinicExpendableInventoryItem(inventoryReceived,function (err,data){
					if(err){console.log(err);}
					clinicExpendableInventoryItems.push(data._id);
					_updateReport(index,array);
				});
			}
		});

		}else {
			_updateReport(0,[0]);
		}

		function _updateReport(index,array) {
		req.params.inventoryReceived = clinicExpendableInventoryItems;
		if(index === array.length - 1)
		schemata.Report.update({_id:req.params._id},
				{
				    revenue: req.params.revenue,
				    bankDeposits: req.params.bankDeposits,
				    expenditure: req.params.expenditure,
				    patientsFeedback: req.params.patientsFeedback,
				    clinicIssues: req.params.clinicIssues,
				    inventoryRequired: req.params.inventoryRequired,
				    inventoryReceived: req.params.inventoryReceived,
				    treatments: req.params.treatments,
				    submitted: req.params.submitted,
				    person: req.params.person
				},
				{},
				function(err,result){
					if(err) res.send(err);
					if(result) _getReport( { query: { date:req.params.date,clinic:req.params.clinic } },
											function(data){
												res.send(data);
											} );
					
				});
		};

	};



};

module.exports = function(schemata) {   
	if(!_instance) _instance = new Report(schemata);
	return _instance;
};