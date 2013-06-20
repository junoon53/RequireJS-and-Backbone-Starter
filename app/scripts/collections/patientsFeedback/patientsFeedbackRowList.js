define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/patientsFeedback/patientsFeedbackRow',
	 'vent'], function(Backbone,$,_,utility,PatientsFeedbackRow,vent) {


	var PatientsFeedbackRowList = Backbone.Collection.extend({
		model: PatientsFeedbackRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);
		},	
		onClose: function() {

		},
		addDataFromReport: function(dataArray){
			var self = this;
            _.each(dataArray,function(element,index,array){
                self.add((new PatientsFeedbackRow({
                    patientName: utility.toTitleCase(element.patient.firstName + " " + element.patient.lastName),
                    patient: element.patient._id,
                    feedback: element.feedback
                })));
            });
		},
		getDataForReport: function(){
			var result = [];
			_.each(this.models,function(element,index,array){
                    var dataMember = {
                        patient: element.get('patient'),
                        feedback: element.get('feedback')
                    };
                    result.push(dataMember);
                });
			return result;
		},
		total: function() {
			this._total = 0;
			var self = this;
			_.each(this.filterInvalidRows(),function(row, i,data) {
				 self._total+= parseInt(row.get("feedback"),10);
			});
			return this._total;
		},
		filterInvalidRows: function(){
			return _.reject(this.models,function(element){return !element.isValid()});
		},
		isValid: function() {
			var result = true;
			_.each(this.models,function(element){

				if(!element.isValid(true)){
				    result = false;
				}
			});
			return result;
		},
		
	});

	return PatientsFeedbackRowList

});
