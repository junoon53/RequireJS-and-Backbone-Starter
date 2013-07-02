var _instance = null;

function Auth(schemata) {


	var CryptoJS = require('cryptojs').Crypto;
	var crypto = require('crypto');

	var pwdDecipher = crypto.createDecipher('aes192','55U8YP%!pjWhwy!JM8wZ6K');
	 
	/******************Redis*******************************/

	var redis = require('redis');
	var redisClient = redis.createClient();

	redisClient.on('error', function(err){
		console.log('redis error: '+err);
	});



	

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

				schemata.User.find({username:username,password:password})
				.populate('person')
				.execFind(function(err,data){
					schemata.Role.populate(data, {
				    path: 'person.roles'
				  	}, function(err,data){
				  		if(err) console.log(err);
				  		schemata.Clinic.populate(data,{
				  			path: 'person.clinics'
				  		}, function(err, data){
				  		    if(err) console.log(err);
				  		    if(data.length) {
				  		    	console.log('login successful')
				  		    	console.log(data[0]);
				  		    	res.send(data[0]);
				  		    } else {
				  		    	console.log('login failed');
				  		    	res.send(data[0]);
				  		    }
				  		});
				     });			
				});

	};
	
	this.login = function(req,res,next){
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");
		var username = req.params.username;
		var password = req.params.password;
	   	var clientKey = req.params.clientKey;
	 
		//var b = new Buffer(req.params.password,'hex');
	   	//var decryptedPwd = b.toString('utf8');
		//decryptedPwd = CryptoJS.AES.decrypt(decryptedPwd,req.params.clientKey);
		//console.log('decryptedPwd: '+decryptedPwd);
		
		//_validateClient(clientKey,res,function(){
			_login(username,password,res);
			
		//})

	};

	this.authenticate = function(req,res,next){
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

};



module.exports = function(schemata) {   
	if(!_instance) _instance = new Auth(schemata);
	return _instance;
};