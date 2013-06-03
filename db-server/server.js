var restify = require('restify');
var server = restify.createServer();
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser({ mapParams: false }));

var mongoose = require('mongoose');
//var config = require('./config');
db = mongoose.connect('mongodb://localhost/cdfdb');

mongoose.connection.on("open", function(){
  console.log("mongodb is connected!!");
});

Schema = mongoose.Schema;

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

var ExpendableInventoryTypeSchema = new Schema({
	_id:Number,
	name:String
});
mongoose.model('ExpendableInventoryType',ExpendableInventoryTypeSchema,'expendableInventoryTypes');
var ExpendableInventoryType = mongoose.model('ExpendableInventoryType');



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

	Role.find().execFind(function(err,data){
		if(err) console.log(err)
			res.send(data);
	});
};


function getReport(req,res,next){
	console.log('getting report for date: '+ req.query.date);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

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
	.execFind(function(err,data){
		     ExpendableInventoryType.populate(data, {path: 'inventoryRequired.expendableInventoryItem.expendableInventoryType'},function(err,data){
		     	console.log(data);
				res.send(data[0]);
		     });
			
	});
};


function addReport(req,res,next){
	console.log('saving report for date: '+ req.params.date);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	var report = new Report();
	report.date = req.params.date;
	report.clinic = req.params.clinic;
	report.person = req.params.person;
	report.revenue = req.params.revenue;
	report.bankDeposits = req.params.bankDeposits;
	report.expenditure = req.params.expenditure;
	report.patientsFeedback = req.params.patientsFeedback;
	report.clinicIssues = req.params.clinicIssues;
	report.inventoryRequired = req.params.inventoryRequired;

	report.save(function(err,data){
			res.send(data);
		});
};

function updateReport(req,res,next){
	console.log('updating report with Id : '+ req.params._id);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	Report.update({_id:req.params.id},
					{
					    revenue: req.params.revenue,
					    bankDeposits: req.params.bankDeposits,
					    expenditure: req.params.expenditure,
					    patientsFeedback: req.params.patientsFeedback,
					    clinicIssues: req.params.clinicIssues,
					    inventoryRequired: req.params.inventoryRequired
					},
					{},
					function(err,result){
						if(err) res.send(err);
						if(result) res.send(result);
						
					});

};


function auth(req,res,next){
	console.log('authenticating...'+ req.params.username + " " + req.params.password);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	var username = req.params.username;
	var password = req.params.password;

	User.find({username:username,password:password})
	.populate('person')
	.execFind(function(err,data){
		Role.populate(data, {
	    path: 'person.roles'
	  	}, function(err,data){
	  		console.log(err);
	  		Clinic.populate(data,{
	  			path: 'person.clinics'
	  		}, function(err, data){
	  		    console.log(err);
	  			res.send(data[0]);
	  		});
	     });			
	});
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

	var expendableInventoryItem = new ExpendableInventoryMaster();
	expendableInventoryItem.genericName = req.params.genericName;
	expendableInventoryItem.brandName = req.params.brandName;
	expendableInventoryItem.accountingUnit = req.params.accountingUnit;
	expendableInventoryItem.expendableInventoryType = req.params.expendableInventoryType;

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
	var person = new Person();
	person.firstName = req.params.firstName;
	person.lastName = req.params.lastName;
	person.id = req.params.firstName.toUpperCase()+" "+req.params.lastName.toUpperCase();
	person.isActive = req.params.isActive;
	person.clinics = req.params.clinics;
	person.roles = req.params.roles;

	Person.count({},function(err,count){
		person._id = 1001+count;
		person.save(function(err,data){
			console.log(err);
			console.log(data);
			res.send(data);
		});
	});	
};


// set up our routes and start the server

server.get('/persons',getPersons);
server.post('/persons',addNewPerson);

server.get('/expendableInventoryTypes', getExpendableInventoryTypes);

server.get('/expendableInventoryMaster',getExpendableInventoryItems);
server.post('/expendableInventoryMaster',addExpendableInventoryItem);

server.get('/roles',getRoles);

server.get('/paymentOptions',getPaymentOptions);

server.post('/clinics',saveClinic);
server.get('/clinics',getClinics);

server.post('/auth',auth);

server.get('/report',getReport);
server.post('/report',addReport);
server.put('/report', updateReport);
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
