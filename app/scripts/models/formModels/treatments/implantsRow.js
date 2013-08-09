define(['backbone','underscore'], function(Backbone,_) {

	var ImplantsRow = Backbone.Model.extend({
		defaults: function() {
			return {
				patientName: '',
				patient:null,
				implantologistName: '',
				implantologist:null,
				prosthodontistName: '',
				prosthodontist:null,
				treatmentName: '',
				treatment:null,
				tooth: 0,
				brand:'',
				partNo:'',
				length:0,
				diameter:0,
				rowId:0
			}
		},
		validation: {
		    patient: {
		      pattern: 'digits',
		      required: true,	
		      range: [1000,10000],
		      msg: "Please select a patient"
		    },
		    treatment: {
		      pattern: 'digits',
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a treatment"
		    },
		    implantologist: {
		      pattern: 'digits',
		      required: true,
		      range: [1000,10000],
		      msg: "Please select an implantologist"
		    },
		    prosthodontist: {
		      pattern: 'digits',
		      required: false,
		      range: [1000,10000],
		      msg: "Please select a prosthodontist"
		    },
		    tooth: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [11, 100],
		    	msg: "Please enter a valid tooth"
		    },
		    length: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 100],
		    	msg: "Please enter a valid length"
		    },
		    diameter: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 100],
		    	msg: "Please enter a valid diameter"
		    }

		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return ImplantsRow;

});