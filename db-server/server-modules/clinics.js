var _instance = null;

function Clinic(schemata) {

	

	this.saveClinic = function(req,res,next){
		console.log("saving clinic : "+req.params);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");
		var clinic = new schemata.Clinic();
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

	this.getClinics = function(req,res,next){
		console.log('sending clinics');
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		schemata.Clinic.find().execFind(function(arr,data){
	    	res.send(data);
		});
	};



};

module.exports = function(schemata) {   
	if(!_instance) _instance = new Clinic(schemata);
	return _instance;
};