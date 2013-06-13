define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/treatments/crownNBridgeRow',
	 'vent'
	 ], function(Backbone,$,_,utility,CrownNBridgeRow,vent){

	var CrownNBridgeRowList = Backbone.Collection.extend({
		model: CrownNBridgeRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Models.Application:postReportStatus:success', this.reset);
			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);

	    },
	    onClose: function(){

	    },    
		filterInvalidRows: function(models){
			return _.reject(this.models,function(element){return !element.isValid()});
		},
		addDataFromReport: function(dataArray){
			var self = this;
			_.each(_.reject(dataArray,function(element){return !(element.treatment.category._id === 1005)}),function(element,index,array){
                self.add((new CrownNBridgeRow({
                    patientName: element.patient.firstName + " " + element.patient.lastName,
                    patient: element.patient._id,
                    doctorName: element.doctors[0].firstName + " " + element.doctors[0].lastName,
                    doctor: element.doctors[0]._id,
                    treatmentName: utility.toTitleCase(element.treatment.name),
                    treatment: element.treatment._id,
                    
                    // details
                    tooth: element.details.tooth,
                    stageName: utility.toTitleCase(element.details.stage.name),
                    stage: element.details.stage._id,
                    expendableInventoryItem: element.details.expendableInventoryItem._id,
                    genericName: element.details.expendableInventoryItem.genericName
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
    	                stage: {name: element.get('stageName'), _id:element.get('stage') },
        	            expendableInventoryItem: element.get('expendableInventoryItem')
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

	return CrownNBridgeRowList;

});