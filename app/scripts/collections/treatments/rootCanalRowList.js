define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/treatments/rootCanalRow',
	 'vent'
	 ], function(Backbone,$,_,utility,RootCanalRow,vent){

	var RootCanalRowList = Backbone.Collection.extend({
		model: RootCanalRow,
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
			_.each(_.reject(dataArray,function(element){return !(element.treatment.category._id === 1004)}),function(element,index,array){
                self.add((new RootCanalRow({
                    patientName: element.patient.firstName + " " + element.patient.lastName,
                    patient: element.patient._id,
                    doctorName: element.doctors[0].firstName + " " + element.doctors[0].lastName,
                    doctor: element.doctors[0]._id,
                    treatmentName: utility.toTitleCase(element.treatment.name),
                    treatment: element.treatment._id,

                    tooth: element.details.tooth,
                    stageName: utility.toTitleCase(element.details.stage.name),
                    stage: element.details.stage._id,
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
                    details : {
    	                tooth: element.get('tooth'),
	                    stage: { name: element.get('stageName'),_id: element.get('stage') },
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

	return RootCanalRowList;

});