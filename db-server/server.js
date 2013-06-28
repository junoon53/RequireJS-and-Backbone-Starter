/***********Restify***********************************/

var restify = require('restify');

var server = restify.createServer();
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser({ mapParams: false }));

/*******************Encryption************************/

var CryptoJS = require('cryptojs').Crypto;
var crypto = require('crypto');

var pwdDecipher = crypto.createDecipher('aes192','55U8YP%!pjWhwy!JM8wZ6K');
 
/******************Redis*******************************/

var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on('error', function(err){
	console.log('redis error: '+err);
});


/*******************Mongoose**************************/

var mongoose = require('mongoose');
//var config = require('./config');
db = mongoose.connect('mongodb://localhost/cdfdb');

mongoose.connection.on("open", function(){
  console.log("mongodb is connected!!");
});

Schema = mongoose.Schema;

/*******************Schemas**************************/

var ClinicSchema = new Schema({
	_id:Number,
	name:String,
	shortName:String
});
mongoose.model('Clinic',ClinicSchema,'clinics');
var Clinic = mongoose.model('Clinic');

var PersonSchema = new Schema({
	_id:Number,
	firstName:String,
	lastName:String,
	id:String,
	isActive:Number,
	roles: [{ type: Number, ref: 'Role'}],
	clinics: [{ type:Number, ref: 'Clinic' }]
});
mongoose.model('Person',PersonSchema,'people');
var Person = mongoose.model('Person');


var RoleSchema = new Schema({
	_id:Number,
	name:String
});
mongoose.model('Role',RoleSchema,'roles');
var Role = mongoose.model('Role');

var PaymentOptionSchema = new Schema({
	_id:Number,
	name:String
});
mongoose.model('PaymentOption',PaymentOptionSchema,'paymentOptions');
var PaymentOption = mongoose.model('PaymentOption');


var UserSchema = new Schema({
	username:String,
	password:String,
	person: {type: Number, ref: 'Person'}	
});
mongoose.model('User',UserSchema,'users');
var User = mongoose.model('User');

var ReportSchema = new Schema({
	clinic: {type:Number, ref: 'Clinic'},
	date:Date,
	person: {type:Number,ref: 'Person'},
	submitted: Boolean,
	revenue: [{				
				patient: { type: Number, ref: 'Person'},
				doctor: { type: Number, ref: 'Person'},	
				amount: Number,
				paymentOption: { type: Number, ref: 'PaymentOption'}

	}],
	bankDeposits: [{ 
					person: {type:Number,ref:'Person'},
					amount:Number,
	}],
    expenditure: [{
    				item: String,
    				sanctionedBy: { type: Number, ref: 'Person'},
    				receivedBy: { type: Number, ref: 'Person'},
    				amount: Number,
    				qty: Number,
    }],
    patientsFeedback: [{ 
						patient: { type: Number, ref: 'Person'},
						feedback: String
    }],
    clinicIssues: [{
					doctor: { type: Number, ref: 'Person'},	
					issue: String,
    }],
    inventoryRequired: [{
    					  expendableInventoryItem: {type:Number, ref: 'ExpendableInventoryMaster'},
    					  qty: Number
    }],
    inventoryReceived: [{ 
    					  type:Number, ref:'ClinicExpendableInventory'
    }],
    treatments: [{
			    	treatment: { type: Number, ref: 'TreatmentsMaster' },
			    	doctors: [{type: Number, ref: 'Person'}],
			    	patient: {type: Number, ref: 'Person'},
			    	
			    	// optional parameters: 
			    	details: {
			    		expendableInventoryItem: { type:Number, ref: 'ExpendableInventoryMaster'},
			    		tooth: Number,
			    		stage: {name:String,_id:Number},
			    		quadrant: String,
			    		sitting: Number,
			    		numInjections: Number,
			    		numFillings: Number
			    	}

    }]	
 
	
});
mongoose.model('Report',ReportSchema,'reports');
var Report = mongoose.model('Report');

var ExpendableInventoryMasterSchema = new Schema({
	_id:Number,
	genericName:String,
	brandName:String,
	accountingUnit:String,
	expendableInventoryType: {type:Number, ref:'ExpendableInventoryType'}
});
mongoose.model('ExpendableInventoryMaster',ExpendableInventoryMasterSchema,'expendableInventoryMaster');
var ExpendableInventoryMaster = mongoose.model('ExpendableInventoryMaster');

var ClinicExpendableInventorySchema = new Schema({
	_id:Number,
	clinic: {type:Number, ref:'Clinic'},
	expendableInventoryItem: {type:Number, ref:'ExpendableInventoryMaster'},
	qtyReceived:Number,
	qtyRemaining:Number,
	dateReceived:Date,
	dateUpdated:Date,
	dateExpiry:Date,
	receivedBy:{type:Number, ref:'Person'},
});
mongoose.model('ClinicExpendableInventory',ClinicExpendableInventorySchema,'clinicExpendableInventory');
var ClinicExpendableInventory = mongoose.model('ClinicExpendableInventory');


var ExpendableInventoryTypeSchema = new Schema({
	_id:Number,
	name:String
});
mongoose.model('ExpendableInventoryType',ExpendableInventoryTypeSchema,'expendableInventoryTypes');
var ExpendableInventoryType = mongoose.model('ExpendableInventoryType');

var TreatmentsMasterSchema = new Schema({
	_id: Number,
	category: { type: Number, ref: 'TreatmentCategory' },
	name: String, 
});
mongoose.model('TreatmentsMaster',TreatmentsMasterSchema,'treatmentsMaster');
var TreatmentsMaster = mongoose.model('TreatmentsMaster');

var TreatmentCategorySchema = new Schema({
	_id: Number,
	name: String,
	stages: Array
});
mongoose.model('TreatmentCategory', TreatmentCategorySchema, 'treatmentCategories');
var TreatmentCategory = mongoose.model('TreatmentCategory');

var ToothSchema = new Schema({
	_id: Number,
	number: String,
	quadrant: String,
	toothType : String,
	numRoots: Number,
	setType: String
});
mongoose.model('Tooth', ToothSchema, 'teeth');
var Tooth = mongoose.model('Tooth');

/***************************************Utility**************************/


/****************************************Testing************************/

User.find({username:"divyaGaur"}).populate('person').exec(function(err,docs){

	Role.populate(docs, {
    path: 'person.roles'
  	}, function(err,data){

  		Clinic.populate(data,{
  			path: 'person.clinics'
  		}, function(err, data){
  			console.log(data[0]);
  		});
     });	
});

/**************************Functions****************************************/

function getExpendableInventoryTypes(req,res,next){
		console.log('getting expendable inventory types...');
		res.header("Access-Control-Allow-Origin","*");		
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		ExpendableInventoryType.find().execFind(function(err,data){
		if(err) console.log(err)
			res.send(data);
	});
};

function getRoles(req,res,next){
	console.log('getting roles...');
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	_validateClient(req.query.clientKey,res,function(){
		Role.find().execFind(function(err,data){
		if(err) console.log(err)
			res.send(data);
		});

	}); 
};

function checkReportStatus(req,res,next){
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

	Report.find({date:{$gte: startDate, $lt: endDate},clinic:clinic})
	.execFind(function(err,data){
		if(err) {console.log(err); res.send(err);}
		else if(data.length > 0) {
			res.send({reportExists:true});
		} else {
			res.send({reportExists:false});
		}
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

	Report.find({date:{$gte: startDate, $lt: endDate},clinic:clinic})
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
			ExpendableInventoryMaster.populate(data,{path:'inventoryReceived.expendableInventoryItem'},function (err,data){
				if(err) {console.log(err); res.send(err);}
			 	else {
			 		Person.populate(data,{path:'inventoryReceived.receivedBy'},function (err,data) {
						if(err) {console.log(err); res.send(err);}
						else {
							ExpendableInventoryType.populate(data, {path: 'inventoryRequired.expendableInventoryItem.expendableInventoryType'},function (err,data){
								if(err) {console.log(err); res.send(err);}
								else {
									ExpendableInventoryType.populate(data, {path: 'inventoryReceived.expendableInventoryItem.expendableInventoryType'},function (err,data){
						     			if(err) {console.log(err); res.send(err);}
						     			else {
						     				ExpendableInventoryMaster.populate(data,{path: 'treatments.details.expendableInventoryItem'}, function (err,data){
						     					if(err) {console.log(err); res.send(err);}
							     				else {
							     					TreatmentCategory.populate(data,{path: 'treatments.treatment.category'}, function (err,data){
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

function getReport(req,res,next){
	console.log('getting report for date: '+ req.query.date);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	_getReport(req,function(data){
		res.send(data);
	});

};

function _addReport(data,callback){
	var report = new Report({
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
}

function addReport(req,res,next){
	console.log('saving report for date: '+ req.params.date);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	
	var clinicExpendableInventoryItems = [];

	if(req.params.inventoryReceived.length){
	 	req.params.inventoryReceived.forEach(function(item,index,array) {
	 		var inventoryReceived = new ClinicExpendableInventory({
				expendableInventoryItem : item.expendableInventoryItem,
				dateReceived : req.params.date,
				dateUpdated : req.params.date,
				dateExpiry : item.dateExpiry,
				qtyReceived : item.qtyReceived,
				qtyRemaining : item.qtyReceived,
				receivedBy : item.receivedBy,
				clinic : req.params.clinic
			});

	 		_addClinicExpendableInventoryItem(inventoryReceived,function(err,data){
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

};

function updateReport(req,res,next){
	console.log('updating report with Id : '+ req.params._id);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	var clinicExpendableInventoryItems = [];

	if(req.params.inventoryReceived.length){
		req.params.inventoryReceived.forEach(function(item,index,array){
			if(item._id) {
				clinicExpendableInventoryItems.push(item._id);
				_updateClinicExpendableInventoryItem(item,function (err,data){
					if(err){console.log(err);}
					_updateReport(index,array);
				});
			} else {
				var inventoryReceived = new ClinicExpendableInventory({
					expendableInventoryItem : item.expendableInventoryItem,
					dateReceived : req.params.date,
					dateUpdated : req.params.date,
					dateExpiry : item.dateExpiry,
					qtyReceived : item.qtyReceived,
					qtyRemaining : item.qtyReceived,
					receivedBy : item.receivedBy,
					clinic : req.params.clinic
				});
				_addClinicExpendableInventoryItem(inventoryReceived,function (err,data){
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
		Report.update({_id:req.params._id},
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
	}

	

};

function authenticate(req,res,next){
	console.log(JSON.stringify(req.query));
	console.log('starting new session with id: '+req.query.clientKey);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	if(_validateClientKey(req.query.clientKey)){

    var clientValue = Math.floor((Math.random()*Math.pow(10,10))+1);
  	console.log('generated new client value :'+clientValue); 	
   	redisClient.hset("clientCredentials", req.query.clientKey, clientValue, redis.print);

   	res.send({result:true});

	} else {
		res.send({result:false,message:'client auth failed'});
	}
};

function _validateClientKey(key) {
	if(key)
	return true;
};

function _validateClientValue(value) {
	if(value)
	return true;
};

function _validateClient(clientKey,res,callback) {
	var result = false;
 	redisClient.hget(['clientCredentials',clientKey],function(err,clientValue){
 	if(err) {
    		console.log('redis error: '+err);
    		res.send({message:err});
    	}else if(_validateClientValue(clientValue)){
			console.log('client validated'); 
			result =  true;
			callback();
		}else {
    		console.log('unauthorized client');
    		res.send({message:'unauthorized client'});
    	}
    });
	
};

function _login(username,decryptedPwd,res){
	console.log('logging in...'+ username + " " + decryptedPwd);
	var pwdCipher = crypto.createCipher('aes192','55U8YP%!pjWhwy!JM8wZ6K');
	var password = pwdCipher.update(decryptedPwd,'utf8','base64')
	var password = pwdCipher.final('base64');

			User.find({username:username,password:password})
			.populate('person')
			.execFind(function(err,data){
				Role.populate(data, {
			    path: 'person.roles'
			  	}, function(err,data){
			  		if(err) console.log(err);
			  		Clinic.populate(data,{
			  			path: 'person.clinics'
			  		}, function(err, data){
			  		    if(err) console.log(err);
			  		    if(data) {
			  		    	console.log('login successful')
			  		    	res.send(data[0]);
			  		    } else {
			  		    	console.log('login failed');
			  		    	res.send(null);
			  		    }
			  		});
			     });			
			});

};

function login(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	var username = req.params.username;
	var password = req.params.password;
   	var clientKey = req.params.clientKey;
 
	//var b = new Buffer(req.params.password,'hex');
   	//var decryptedPwd = b.toString('utf8');
	//decryptedPwd = CryptoJS.AES.decrypt(decryptedPwd,req.params.clientKey);
	//console.log('decryptedPwd: '+decryptedPwd);
	
	_validateClient(clientKey,res,function(){
		_login(username,password,res);
		
	})

};



function getPersons(req,res,next){
	console.log("sending persons like :"+req.query.searchString+" with roles: "+req.query.roles);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	var roles = req.query.roles;
	console.log(roles);
	Person.find({
				"id" : {$regex : ".*"+req.query.searchString.toUpperCase()+".*"},
				"roles": { $elemMatch: {$in: roles } } })
		.populate('roles')
		.populate('clinics')
		.execFind(function(err,data){
			console.log(err);
			console.log(data);
			res.send(data);
	});

};

function _addClinicExpendableInventoryItem(clinicExpendableInventoryItem,callback){
	ClinicExpendableInventory.count({},function(err,count){
		clinicExpendableInventoryItem._id = Math.floor(Math.random()*10000)+count;
		clinicExpendableInventoryItem.save(function(err,data){
			ExpendableInventoryType.populate(data,{path:'expendableInventoryType'},
			function(err,data){
				Person.populate(data,{path:'receivedBy'},
				function(err,data){
					if(callback) callback(err,data);
				});
			});
			
		});
	});
};

function _updateClinicExpendableInventoryItem(attributes,callback){
	var _id = attributes._id;
	delete attributes._id;
	ClinicExpendableInventory.update(
		{_id:_id},
		attributes,
		{},
		function(err,numAffectedRows,rawResponse){
			if(err) console.log('error: '+err);
			if(callback) callback(err,numAffectedRows);
		}
	);
};

function addClinicExpendableInventoryItem(req,res,next){
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
	
	_addClinicExpendableInventoryItem(clinicExpendableInventoryItem,function(err,data){
		console.log(err);
		console.log(data);
		res.send(data);
	});
};

function getExpendableInventoryItems(req,res,next){
	console.log("sending expendable inventory items like :"+req.query.searchString);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	ExpendableInventoryMaster.find({
				"genericName" : {$regex : ".*"+req.query.searchString.toUpperCase()+".*"}
				 })
		.populate('expendableInventoryType')
		.execFind(function(err,data){
			if(err) console.log(err);
			console.log(data);
			res.send(data);
	});

};

function addExpendableInventoryItem(req,res,next){
	console.log("adding expendable inventory item..."+req.params.genericName);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	var expendableInventoryItem = new ExpendableInventoryMaster({
		genericName:req.params.genericName,
		brandName:req.params.brandName,
		accountingUnit:req.params.accountingUnit,
		expendableInventoryType:req.params.expendableInventoryType
	});

	ExpendableInventoryMaster.count({},function(err,count){
		expendableInventoryItem._id = Math.floor(Math.random()*10000)+count;
		expendableInventoryItem.save(function(err,data){
			ExpendableInventoryType.populate(data,{path:'expendableInventoryType'},
			function(err,data){
				console.log(err);
				console.log(data);
				res.send(data);
			});
			
		});
	});
};


function getPaymentOptions(req,res,next){
	console.log('sending payment options');
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	PaymentOption.find({"name" : {$regex : ".*"+req.query.q+".*"}}).execFind(function(arr,data){
    	res.send(data);
	});
};

function saveClinic(req,res,next){
	console.log("saving clinic : "+req.params);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	var clinic = new Clinic();
	clinic.shortName = req.params.shortName;
	clinic.name = req.params.name;
	
	clinic.count({},function(err,count){
		clinic._id = count;
		clinic.save(function(err,data){
			onsole.log(err);
			console.log(data);
			res.send(data);
		});
	});	

};

function getClinics(req,res,next){
	console.log('sending clinics');
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	clinics.find().execFind(function(arr,data){
    	res.send(data);
	});
};



function addNewPerson(req,res,next){
	console.log("adding new person");
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	var person = new Person({
		firstName : req.params.firstName,
		lastName : req.params.lastName,
		id : req.params.firstName.toUpperCase()+" "+req.params.lastName.toUpperCase(),
		isActive : req.params.isActive,
		clinics : req.params.clinics,
		roles : req.params.roles
	});

	Person.count({},function(err,count){
		person._id = 1001+count;
		person.save(function(err,data){
			console.log(err);
			console.log(data);
			res.send(data);
		});
	});	
};

function getTreatments(req,res,next){
	console.log('sending treatments like '+req.query.searchString);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	TreatmentsMaster.find({
				"name" : {$regex : ".*"+req.query.searchString.toLowerCase()+".*"},
				"category": req.query.category }).execFind(function(err,data){
    					if(err) {console.log(err); res.send(err);}
    					else {res.send(data);}
	});
};

function addNewTreatment(req,res,next){
	console.log("adding new treatment");
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	var treatment = new TreatmentsMaster({
		name: req.params.name,
		category: req.params.category,		
	});

	TreatmentsMaster.count({},function(err,count){
		treatment._id = 1001+count;
		treatment.save(function(err,data){
			console.log(err);
			console.log(data);
			res.send(data);
		});
	});	
};

function getTreatmentStages(req,res,next){
	console.log('sending treatments stages for category '+req.query.category);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	TreatmentCategory.find({_id:req.query.category}).execFind(function(err,data){
    					if(err) {console.log(err); res.send(err);}
    					else res.send(data[0].stages);
	});
};

function addNewTreatmentStage(req,res,next){
	console.log("adding new treatment stage for treatment category: "+req.params.category);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	TreatmentCategory.find({_id:req.params.category}).execFind(function(err,data){
    					if(err) {console.log(err); res.send(err);}
    				    else if(data) {
    				    	data[0].stages.push(req.params.stageName);
    				    	TreatmentCategory.update({_id:req.params.category},
    				    							 { $set : { stages: data[0].stages  } },
    				    					    	 {},
													 function(err,numAffectedRows,rawResponse){
														if(err) {console.log('error: '+err); res.send(err) ;}
														else res.send({stageName:req.params.stageName, _id:numAffectedRows});														
													 }
												);

    				    } else res.send(null);
									
	});
};

// set up our routes and start the server

server.get('/persons',getPersons);
server.post('/persons',addNewPerson);

server.get('/treatments',getTreatments);
server.post('/treatments',addNewTreatment);

server.get('/treatmentStages',getTreatmentStages);
server.post('/treatmentStages',addNewTreatmentStage);

server.get('/expendableInventoryTypes', getExpendableInventoryTypes);

server.get('/expendableInventoryMaster',getExpendableInventoryItems);
server.post('/expendableInventoryMaster',addExpendableInventoryItem);

/*server.get('/clinicexpendableinventory',getClinicExpendableInventoryItem);
server.post('/clinicexpendableinventory',addClinicExpendableInventoryItem);
server.put('/clinicexpendableinventory',updateClinicExpendableInventoryItem);
*/
server.get('/roles',getRoles);

server.get('/paymentOptions',getPaymentOptions);

server.post('/clinics',saveClinic);
server.get('/clinics',getClinics);

server.post('/login', login);
server.get('/auth', authenticate);

server.get('/report',getReport);
server.post('/report',addReport);
server.put('/report', updateReport);
server.get('/reportStatus',checkReportStatus);
//server.del('/report/:_id', deleteReport);

/*******************************************************************************************/

function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version'];

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Methods", "put, GET, PUT, DELETE, OPTIONS");

    return res.send(204);
  }
  else
    return res.send(new restify.MethodNotAllowedError());
}

server.on('MethodNotAllowed', unknownMethodHandler);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
