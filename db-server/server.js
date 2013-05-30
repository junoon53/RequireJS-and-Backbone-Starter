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

var RevenueSchema = new Schema({
	_id:  Number,
	date: Date,
	amount: Number,
	clinic: { type: Number, ref: 'Clinic'},
	patient: { type: Number, ref: 'Person'},
	doctor: { type: Number, ref: 'Person'},	
	paymentOption: { type: Number, ref: 'PaymentOption'}

});
mongoose.model('Revenue',RevenueSchema,'revenue');
var Revenue = mongoose.model('Revenue');


var UserSchema = new Schema({
	username:String,
	password:String,
	person: {type: Number, ref: 'Person'}	
});
mongoose.model('User',UserSchema,'users');
var User = mongoose.model('User');

var DailyFeedbackSchema = new Schema({
	clinic: {type:Number, ref: 'Clinic'},
	date:Date,
	doctor: {type:Number,ref: 'Person'}
});
mongoose.model('DailyFeedback',DailyFeedbackSchema,'dailyfeedback');
var DailyFeedback = mongoose.model('DailyFeedback');

var BankDepositsSchema = new Schema({
	_id:Number,
	clinic: {type:Number, ref:'Clinic'},
	date:Date,
	person: {type:Number,ref:'Person'},
	amount:Number
});
mongoose.model('BankDeposits',BankDepositsSchema,'bankdeposits');
var BankDeposits = mongoose.model('BankDeposits');

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

function getRoles(req,res,next){
	console.log('getting roles...');
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	Role.find().execFind(function(err,data){
		if(err) console.log(err)
			res.send(data);
	})
};


function checkFeedbackStatus(req,res,next){
	console.log('checking daily feedback status for date: '+ req.query.date);
	console.log('role: '+req.query.role);
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

	DailyFeedback.find({date:{$gte: startDate, $lt: endDate},clinic:clinic}).execFind(function(err,data){
			console.log(data);
			res.send(data[0]);
	});
};


function saveFeedbackStatus(req,res,next){
	console.log('saving feedback status for date: '+ req.params.date);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	var feedback = new DailyFeedback();
	feedback.date = req.params.date;
	feedback.clinic = req.params.clinicId;
	feedback.doctor = req.params.doctorId;

	feedback.save(function(){
			res.send(req.body);
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

function saveRevenue(req,res,next){
	console.log("saving revenue : "+req.params);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	var revenueEntry = new Revenue();
	revenueEntry.date = req.params.date;
	revenueEntry.clinic = parseInt(req.params.clinic,10);
	revenueEntry.patient = parseInt(req.params.patient,10);
	revenueEntry.doctor= parseInt(req.params.doctor,10);
	revenueEntry.amount = parseInt(req.params.amount,10);
	revenueEntry.paymentOption = parseInt(req.params.paymentOption,10);

	Revenue.count({},function(err,count){
		revenueEntry._id = Math.random(4)+(new Date()).getMilliseconds()+count;
		revenueEntry.save(function(err,data){
		    if(err) console.log(err);
		    res.send(data);
		});
	});	

};

function updateRevenue(req,res,next){
	console.log("saving revenue : "+req.params);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	Revenue.update({_id:req.params._id},
				   { 
						date:req.params.date,
						clinic:req.params.clinic,
						patient:req.params.patient,
						doctor:req.params.doctor,
						amount:req.params.amount,
						paymentOption: req.params.paymentOption
					},
				   {},
				   function(err,data){
				   	if(err) console.log(err);
		    		res.send(data);
				   }
				  );

};

function deleteRevenue(req,res,next){
	console.log("deleting revenue: "+req.params._id);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	Revenue.remove({_id:req.params._id},function(err){
		if(err) {console.log(err);
					res.send(err);}

	});
};

function getRevenueOnDate(req,res,next){
	console.log("getting revenue for: "+req.query.date);
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

	Revenue.find({date:{$gte: startDate, $lt: endDate},clinic:clinic})
	.populate('doctor')
	.populate('patient')
	.populate('clinic')
	.populate('paymentOption')
	.execFind(function(err,data){
		console.log(err);
		res.send(data);
	});

};

function getRevenueBetweenDates(req,res,next){
	console.log('getting revenue between dates: '+req.params.startDate+" "+req.params.endDate);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	var startDate = new Date(req.params.startDate);
	var endDate = new Date(req.params.endDate);

	startDate.setHours(0);
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);

	endDate.setHours(0);
	endDate.setMinutes(0);
	endDate.setSeconds(0);
	endDate.setMilliseconds(0);

	endDate.setHours(24);

	Revenue.find({date:{$gte: startDate, $lt: endDate},clinic:clinic})
	.populate('doctor')
	.populate('patient')
	.populate('clinic')
	.populate('paymentOption')
	.execFind(function(err,data){
		console.log(err);
		res.send(data);
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
		clinic.save(function(){
			res.send(req.body);
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
		person.save(function(){
			res.send(req.body);
		});
	});	
};

function addBankDeposit(req,res,next){
	console.log("adding new person");
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	var bankDeposit = new BankDeposits();
	bankDeposit.person = req.params.person;
	bankDeposit.clinic = req.params.clinic;
	bankDeposit.date = req.params.date;
	bankDeposit.amount = req.params.amount;

	BankDeposits.count({},function(err,count){
		bankDeposit._id = Math.random(4)+(new Date()).getMilliseconds()+count;
		bankDeposit.save(function(err,data){
		    if(err) console.log(err);
		    res.send(data);
		});
	});	
};

function getBankDeposits(req,res,next){
	console.log('getting bank deposits on date: '+req.query.date);
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

	BankDeposits.find({date:{$gte: startDate, $lt: endDate},clinic:clinic})
	.populate('person')
	.populate('clinic')
	.execFind(function(err,data){
		console.log(err);
		res.send(data);
	});
};

function updateBankDeposit(req,res,next){
	console.log("saving revenue : "+req.params);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	BankDeposits.update({_id:req.params._id},
				   { 
						date:req.params.date,
						clinic:req.params.clinic,
						person:req.params.person,
						amount:req.params.amount,
					},
				   {},
				   function(err,data){
				   	if(err) console.log(err);
		    		res.send(data);
				   }
				  );

};


function deleteBankDeposit(req,res,next){
	console.log("deleting revenue: "+req.params._id);
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");

	BankDeposits.remove({_id:req.params._id},function(err){
		if(err) {console.log(err);
					res.send(err);}

	});
};


// set up our routes and start the server 
server.get('/persons',getPersons);
server.post('/persons',addNewPerson);


server.get('/roles',getRoles);

server.get('/paymentOptions',getPaymentOptions);

server.post('/revenue',saveRevenue);
server.put('/revenue/:_id',updateRevenue);
server.get('/revenue',getRevenueOnDate);
server.del('/revenue/:_id',deleteRevenue);

server.post('/bankDeposits', addBankDeposit);
server.get('/bankDeposits', getBankDeposits);
server.put('/bankDeposits/:_id', updateBankDeposit);
server.del('/bankDeposits/:_id', deleteBankDeposit);


server.post('/clinics',saveClinic);
server.get('/clinics',getClinics);

server.post('/auth',auth);

server.get('/feedback',checkFeedbackStatus);
server.post('/feedback',saveFeedbackStatus);

server.post('/revenueReport',getRevenueBetweenDates);





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
