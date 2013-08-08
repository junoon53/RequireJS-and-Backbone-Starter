var mongoose = require('mongoose');
Schema = mongoose.Schema;
var _instance = null;


function Schemas() {



	var result = {};

	var ClinicSchema = new Schema({
		_id:Number,
		name:String,
		shortName:String
		});
		mongoose.model('Clinic',ClinicSchema,'clinics');
	result.Clinic = mongoose.model('Clinic');

	var PersonSchema = new Schema({
		_id:Number,
		salutation: String,
		firstName:String,
		lastName:String,
		id:String,
		isActive:Number,
		sex: String,
		age: Number,
		address: String,    
		roles: [{ type: Number, ref: 'Role'}],
		clinics: [{ type:Number, ref: 'Clinic' }]
	});
	mongoose.model('Person',PersonSchema,'people');
	result.Person = mongoose.model('Person');


	var RoleSchema = new Schema({
		_id:Number,
		name:String
	});
	mongoose.model('Role',RoleSchema,'roles');
	result.Role = mongoose.model('Role');

	var PaymentOptionSchema = new Schema({
		_id:Number,
		name:String
	});
	mongoose.model('PaymentOption',PaymentOptionSchema,'paymentOptions');
	result.PaymentOption = mongoose.model('PaymentOption');


	var UserSchema = new Schema({
		username:String,
		password:String,
		person: {type: Number, ref: 'Person'}	
	});
	mongoose.model('User',UserSchema,'users');
	result.User = mongoose.model('User');

	var ReportSchema = new Schema({
		clinic: {type:Number, ref: 'Clinic'},
		date:Date,
		person: {type:Number,ref: 'Person'},
		submitted: Boolean,
		revenue: [{				
					patient: { type: Number, ref: 'Person'},
					doctor: { type: Number, ref: 'Person'},	
					amount: Number,
					consultantFee: Number,
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
						status: String,
						priority: String,
						dueDate: Date,
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
				    		numFillings: Number,
				    		remarks: String,
				    	}

	    }],
	    
	 
		
	});
	mongoose.model('Report',ReportSchema,'reports');
	result.Report = mongoose.model('Report');

	var ExpendableInventoryMasterSchema = new Schema({
		_id:Number,
		genericName:String,
		brandName:String,
		accountingUnit:String,
		expendableInventoryType: {type:Number, ref:'ExpendableInventoryType'}
	});
	mongoose.model('ExpendableInventoryMaster',ExpendableInventoryMasterSchema,'expendableInventoryMaster');
	result.ExpendableInventoryMaster = mongoose.model('ExpendableInventoryMaster');

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
	result.ClinicExpendableInventory = mongoose.model('ClinicExpendableInventory');


	var ExpendableInventoryTypeSchema = new Schema({
		_id:Number,
		name:String
	});
	mongoose.model('ExpendableInventoryType',ExpendableInventoryTypeSchema,'expendableInventoryTypes');
	result.ExpendableInventoryType = mongoose.model('ExpendableInventoryType');

	var TreatmentsMasterSchema = new Schema({
		_id: Number,
		category: { type: Number, ref: 'TreatmentCategory' },
		name: String, 
	});
	mongoose.model('TreatmentsMaster',TreatmentsMasterSchema,'treatmentsMaster');
	result.TreatmentsMaster = mongoose.model('TreatmentsMaster');

	var TreatmentCategorySchema = new Schema({
		_id: Number,
		name: String,
		stages: Array
	});
	mongoose.model('TreatmentCategory', TreatmentCategorySchema, 'treatmentCategories');
	result.TreatmentCategory = mongoose.model('TreatmentCategory');

	var ToothSchema = new Schema({
		_id: Number,
		number: String,
		quadrant: String,
		toothType : String,
		numRoots: Number,
		setType: String
	});
	mongoose.model('Tooth', ToothSchema, 'teeth');
	result.Tooth = mongoose.model('Tooth');


	var ClinicTreatmentDetailsSchema = new Schema({
			_id: Number,
			treatment: { type: Number, ref: 'TreatmentsMaster' },
			rate: Number, 
	});
	mongoose.model('ClinicTreatmentDetails', ClinicTreatmentDetailsSchema, 'clinicTreatmentDetails');
	result.ClinicTreatmentDetails = mongoose.model('ClinicTreatmentDetails');



	return result;

};




module.exports = (function () {
	if(!_instance ) _instance = Schemas();

	return _instance;
})();