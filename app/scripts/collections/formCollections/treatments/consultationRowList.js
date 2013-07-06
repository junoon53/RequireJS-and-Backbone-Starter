define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/formModels/treatments/consultationRow',
	 'vent',
	 'utility'
	 ], function(Backbone,$,_,utility,ConsultationRow,vent,utility){

	var ConsultationRowList = Backbone.Collection.extend({
		model: ConsultationRow,
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
			_.each(_.reject(dataArray,function(element){return !(element.treatment.category._id === 1000)}),function(element,index,array){
                self.add((new ConsultationRow({
                    patientName: utility.toTitleCase(element.patient.firstName + " " + element.patient.lastName),
                    patient: element.patient._id,
                    doctorName: utility.toTitleCase(element.doctors[0].firstName + " " + element.doctors[0].lastName),
                    doctor: element.doctors[0]._id,
                    treatmentName: utility.toTitleCase(element.treatment.name),
                    treatment: element.treatment._id,
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

	return ConsultationRowList;

});