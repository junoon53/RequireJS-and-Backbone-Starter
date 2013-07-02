/***********Restify***********************************/

var restify = require('restify');

var server = restify.createServer();
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser({ mapParams: false }));

/*******************Mongoose**************************/

var mongoose = require('mongoose');
//var config = require('./config');
db = mongoose.connect('mongodb://localhost/cdfdb');

mongoose.connection.on("open", function(){
  console.log("mongodb is connected!!");
});

/******************Load Server Modules******************/

var Schemata = require('./server-modules/schema.js');
var People = require('./server-modules/people.js')(Schemata);
var Clinics = require('./server-modules/clinics.js')(Schemata);
var Inventory = require('./server-modules/inventory.js')(Schemata);
var Report = require('./server-modules/report.js')(Schemata);
var Treatment = require('./server-modules/treatment.js')(Schemata);
var Auth = require('./server-modules/auth.js')(Schemata);

/****************************************Testing************************/

Schemata.User.find({username:"divyaGaur"}).populate('person').exec(function(err,docs){

	Schemata.Role.populate(docs, {
    path: 'person.roles'
  	}, function(err,data){

  		Schemata.Clinic.populate(data,{
  			path: 'person.clinics'
  		}, function(err, data){
  			console.log(data[0]);
  		});
     });	
});

/**************************Functions****************************************/


function getPaymentOptions(req,res,next){
	console.log('sending payment options');
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	Schemata.PaymentOption.find({"name" : {$regex : ".*"+req.query.q+".*"}}).execFind(function(arr,data){
    	res.send(data);
	});
};

// set up our routes and start the server

server.get('/persons',People.getPersons);
server.post('/persons',People.addNewPerson);

server.get('/treatments',Treatment.getTreatments);
server.post('/treatments',Treatment.addNewTreatment);

server.get('/treatmentStages',Treatment.getTreatmentStages);
server.post('/treatmentStages',Treatment.addNewTreatmentStage);

server.get('/expendableInventoryTypes', Inventory.getExpendableInventoryTypes);

server.get('/expendableInventoryMaster', Inventory.getExpendableInventoryItems);
server.post('/expendableInventoryMaster',Inventory.addExpendableInventoryItem);

/*server.get('/clinicexpendableinventory',getClinicExpendableInventoryItem);
server.post('/clinicexpendableinventory',addClinicExpendableInventoryItem);
server.put('/clinicexpendableinventory',updateClinicExpendableInventoryItem);
*/
server.get('/roles',People.getRoles);

server.get('/paymentOptions',getPaymentOptions);

server.post('/clinics',Clinics.saveClinic);
server.get('/clinics',Clinics.getClinics);

server.post('/login', Auth.login);
server.get('/auth', Auth.authenticate);

server.get('/report',Report.getReport);
server.post('/report',Report.addReport);
server.put('/report', Report.updateReport);
server.get('/reportStatus', Report.checkReportStatus);
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
