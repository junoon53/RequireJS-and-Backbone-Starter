define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/formModels/treatments/implantsRow',
	 'vent'
	 ], function(Backbone,$,_,utility,ImplantsRow,vent){

	var ImplantsRowList = Backbone.Collection.extend({
		model: ImplantsRow,
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
			_.each(_.reject(dataArray,function(element){return !(element.treatment.category._id === 1012)}),function(element,index,array){
                self.add((new ImplantsRow({
                    patientName: utility.toTitleCase(element.patient.firstName + " " + element.patient.lastName),
                    patient: element.patient._id,
                    implantologistName: utility.toTitleCase(element.doctors[0].firstName + " " + element.doctors[0].lastName),
                    implantologist: element.doctors[0]._id,
                    prosthodontistName: utility.toTitleCase(element.doctors[1].firstName + " " + element.doctors[1].lastName),
                    prosthodontist: element.doctors[1]._id,
                    treatmentName: utility.toTitleCase(element.treatment.name),
                    treatment: element.treatment._id,
                    // details
                    tooth: element.details.tooth,
                    brand: element.details.brand,
                    length: element.details.length,
                    diameter: element.details.diameter,
                    partNo: element.details.partNo

                })));
            });
		},
		getDataForReport: function(){
			var result = [];
		    _.each(this.models,function(element,index,array){                    
               var dataMember = {
                    patient: element.get('patient'),
                    doctors: [element.get('implantologist'), element.get('prosthodontist')],
                    treatment: element.get('treatment'),

                    details: {
                    	tooth: element.get('tooth'),
                    	brand: element.get('brand'),
                    	partNo: element.get('partNo'),
                    	length: element.get('length'),
                    	diameter: element.get('diameter'),
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

	return ImplantsRowList;

});