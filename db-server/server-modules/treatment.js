var _instance = null;


function Treatment(schemata) {

	

	this.getTreatments = function(req,res,next){
		console.log('sending treatments like '+req.query.searchString);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		schemata.TreatmentsMaster.find({
				"name" : {$regex : ".*"+req.query.searchString.toLowerCase()+".*"},
				"category": req.query.category }).execFind(function(err,data){
    					if(err) {console.log(err); res.send(err);}
    					else {res.send(data);}
		});
	};

	this.addNewTreatment = function(req,res,next){
		console.log("adding new treatment");
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		var treatment = new schemata.TreatmentsMaster({
			name: req.params.name.toLowerCase(),
			category: req.params.category,		
		});

		schemata.TreatmentsMaster.count({},function(err,count){
			treatment._id = 1001+count;
			treatment.save(function(err,data){
				if(err) console.log(err);
				console.log(data);
				res.send(data);
			});
		});	
	};

	this.getTreatmentStages = function(req,res,next){
		console.log('sending treatments stages for category '+req.query.category);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		schemata.TreatmentCategory.find({_id:req.query.category}).execFind(function(err,data){
	    					if(err) {console.log(err); res.send(err);}
	    					else res.send(data[0].stages);
		});
	};

	this.addNewTreatmentStage = function(req,res,next){
		console.log("adding new treatment stage for treatment category: "+req.params.category);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		schemata.TreatmentCategory.find({_id:req.params.category}).execFind(function(err,data){
	    					if(err) {console.log(err); res.send(err);}
	    				    else if(data) {
	    				    	data[0].stages.push(req.params.stageName);
	    				    	schemata.TreatmentCategory.update({_id:req.params.category},
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


};

module.exports = function(schemata) {   
	if(!_instance) _instance = new Treatment(schemata);
	return _instance;
};