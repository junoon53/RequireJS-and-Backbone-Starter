var _instance = null;

function Analytics(schemata) {

	

	this.getRevenue = function(req,res,next){
		console.log("getting revenue : "+req.params);
		res.header("Access-Control-Allow-Origin","*");

		  var fromDate = new Date(req.query.fromDate);
		  var toDate = new Date(req.query.toDate);
		  
		  fromDate.setHours(0);
		  fromDate.setMinutes(0);
		  fromDate.setSeconds(0);
		  fromDate.setMilliseconds(0);
		  console.log(fromDate);

		  toDate.setHours(24);
		  console.log(toDate);

		  if(req.query.clinic){
		    var clinic = parseInt(req.query.clinic,0);
		    console.log(clinic);
		  }

		  schemata.Report.find({ date: {  $gte: fromDate, $lt: toDate  }, clinic:clinic })
		  .select('revenue clinic date')
		  .populate('revenue.doctor')
		  .populate('revenue.patient')
		  .populate('revenue.paymentOption')
		  .lean().execFind(function(err,data){
		       if(err) {
		          res.send(err);
		          return;
		       } else {

		          /*var result = [];
		          data.forEach(function(element){
		              element.revenue.forEach(function(item){
		                item.reportId = element._id;
		                item.clinic = element.clinic;
		                item.date = element.date;
		                result.push(item);
		              });
		          });*/
		          res.send(data);
		       }
		  });		

	};

	this.getExpenditure = function(req,res,next){
		console.log('sending expenditure');
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		  var fromDate = new Date(req.query.fromDate);
		  var toDate = new Date(req.query.toDate);
		  
		  fromDate.setHours(0);
		  fromDate.setMinutes(0);
		  fromDate.setSeconds(0);
		  fromDate.setMilliseconds(0);
		  console.log(fromDate);

		  toDate.setHours(24);
		  console.log(toDate);

		  if(req.query.clinic){
		    var clinic = parseInt(req.query.clinic,0);
		    console.log(clinic);
		  }

		  schemata.Report.find({ date: {  $gte: fromDate, $lt: toDate  }, clinic:clinic })
		  .select('expenditure clinic date')
		  .populate('expenditure.sanctionedBy')
		  .populate('expenditure.receivedBy')
		  .lean().execFind(function(err,data){
		       if(err) {
		          res.send(err);
		          return;
		       } else {

		          /*var result = [];
		          data.forEach(function(element){
		              element.expenditure.forEach(function(item){
		                item.reportId = element._id;
		                item.clinic = element.clinic;
		                item.date = element.date;
		                result.push(item);
		              });
		          });*/
		          res.send(data);
		       }
		  });		

	};

	this.getTreatments = function(req,res,next){
		console.log('sending treatments');
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		  var fromDate = new Date(req.query.fromDate);
		  var toDate = new Date(req.query.toDate);
		  
		  fromDate.setHours(0);
		  fromDate.setMinutes(0);
		  fromDate.setSeconds(0);
		  fromDate.setMilliseconds(0);
		  console.log(fromDate);

		  toDate.setHours(24);
		  console.log(toDate);

		  if(req.query.clinic){
		    var clinic = parseInt(req.query.clinic,0);
		    console.log(clinic);
		  }

		  schemata.Report.find({ date: {  $gte: fromDate, $lt: toDate  }, clinic:clinic })
		  .select('treatments clinic date')
		  .populate('treatment.patient')
		  .populate('treatment.doctors')
		  .populate('treatment.treatment')
		  .lean().execFind(function(err,data){
		       if(err) {
		          res.send(err);
		          return;
		       } else {
		          res.send(data);
		       }
		  });		

	};





};

module.exports = function(schemata) {   
	if(!_instance) _instance = new Analytics(schemata);
	return _instance;
};