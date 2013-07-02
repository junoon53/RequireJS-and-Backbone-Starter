var _instance = null;

function People(schemata) {

	

	this.getRoles = function(req,res){
		console.log('getting roles...');
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");

		///_validateClient(req.query.clientKey,res,function(){
			schemata.Role.find().execFind(function(err,data){
			if(err) console.log(err)
				res.send(data);
			});

		//}); 
	};

	this.getPersons = function( req,res,next){
		console.log("sending persons like :"+req.query.searchString+" with roles: "+req.query.roles);
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");
		var roles = req.query.roles;
		console.log(roles);
		schemata.Person.find({
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

	this.addNewPerson  = function ( req,res,next){
		console.log("adding new person");
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");
		var person = new schemata.Person({
			firstName : req.params.firstName,
			lastName : req.params.lastName,
			id : req.params.firstName.toUpperCase()+" "+req.params.lastName.toUpperCase(),
			isActive : req.params.isActive,
			clinics : req.params.clinics,
			roles : req.params.roles
		});

		schemata.Person.count({},function(err,count){
			person._id = 1001+count;
			person.save(function(err,data){
				console.log(err);
				console.log(data);
				res.send(data);
			});
		});	
	};

};

module.exports = function(schemata) {   
	if(!_instance) _instance = new People(schemata);
	return _instance;
};