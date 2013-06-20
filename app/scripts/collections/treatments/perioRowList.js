define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/treatments/perioRow',
	 'vent'
	 ], function(Backbone,$,_,utility,PerioRow,vent){

	var PerioRowList = Backbone.Collection.extend({
		model: PerioRow,
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
			_.each(_.reject(dataArray,function(element){return !(element.treatment.category._id === 1009)}),function(element,index,array){
                self.add((new PerioRow({
                    patientName: element.patient.firstName + " " + element.patient.lastName,
                    patient: element.patient._id,
                    doctorName: element.doctors[0].firstName + " " + element.doctors[0].lastName,
                    doctor: element.doctors[0]._id,
                    treatmentName: utility.toTitleCase(element.treatment.name),
                    treatment: element.treatment._id,

                    quadrant: element.details.quadrant,
                    sitting: element.details.sitting,
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
                    quadrant: element.get('quadrant'),
                    sitting: element.get('sitting'),
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

	return PerioRowList;

});