define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/formModels/treatments/denturesRow',
	 'vent',
	 'utility'
	 ], function(Backbone,$,_,utility,DenturesRow,vent,utility){

	var DenturesRowList = Backbone.Collection.extend({
		model: DenturesRow,
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
			_.each(_.reject(dataArray,function(element){return !(element.treatment.category._id === 1001)}),function(element,index,array){
                self.add((new DenturesRow({
                    patientName: utility.toTitleCase(element.patient.firstName + " " + element.patient.lastName),
                    patient: element.patient._id,
                    doctorName: utility.toTitleCase(element.doctors[0].firstName + " " + element.doctors[0].lastName),
                    doctor: element.doctors[0]._id,
                    treatmentName: utility.toTitleCase(element.treatment.name),
                    treatment: element.treatment._id,
                    
                    stageName: utility.toTitleCase(element.details.stage.name),
                    stage: element.details.stage._id,
                    remarks:element.details ?  element.details.remarks: ""  
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
	                    stage: { name: element.get('stageName'), _id: element.get('stage') },
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

	return DenturesRowList;

});