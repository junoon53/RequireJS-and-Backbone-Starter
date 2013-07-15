define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'models/formModels/treatments/extractionsRow',
	 'vent',
	 'utility'
	 ], function(Backbone,$,_,ExtractionsRow,vent,utility){

	var ExtractionsRowList = Backbone.Collection.extend({
		model: ExtractionsRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);

	    },
	    onClose: function(){

	    },    
		filterInvalidRows: function(models){
			return _.reject(this.models,function(element){return !element.isValid()});
		},
		addDataFromReport: function(dataArray){
			var self = this;
			_.each(_.reject(dataArray,function(element){return !(element.treatment.category._id === 1002)}),function(element,index,array){
                self.add((new ExtractionsRow({
                    patientName: utility.toTitleCase(element.patient.firstName + " " + element.patient.lastName),
                    patient: element.patient._id,
                    doctorName: utility.toTitleCase(element.doctors[0].firstName + " " + element.doctors[0].lastName),
                    doctor: element.doctors[0]._id,
                    treatmentName: utility.toTitleCase(element.treatment.name),
                    treatment: element.treatment._id,
                    tooth: element.details.tooth,
                    numInjections: element.details.numInjections,
                    remarks: element.details ?  element.details.remarks: ""  
                })));
            });
		},
		getDataForReport: function(){
			var result = [];
		    _.each(this.models,function(element,index,array){                    
               var dataMember = {
                    patient: element.get('patient'),
                    doctors: [element.get('doctor')],
                    treatment: element.get('treatment'),
                    details: {
	                    tooth: element.get('tooth'),
    	                numInjections: element.get('numInjections'),
    	                remarks: element.get('remarks')
                    }
                };
                result.push(dataMember);
            });
		 	return result;
		},
		isValid: function() {
			var result = true;
			_.each(this.models,function(element){

				if(!element.isValid(true)){
				    result = false;
				}
			});
			return result;
		}
		
	});

	return ExtractionsRowList;

});