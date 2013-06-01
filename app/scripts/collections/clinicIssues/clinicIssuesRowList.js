define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'models/clinicIssues/clinicIssuesRow',
	 'vent'], function(Backbone,$,_,ClinicIssuesRow,vent) {


	var ClinicIssuesRowList = Backbone.Collection.extend({
		model: ClinicIssuesRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Models.Application:postReportStatus:success', this.reset);
			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);
		},	
		onClose: function() {

		},
		addDataFromReport: function(dataArray){
			var self = this;
            _.each(dataArray,function(element,index,array){
                self.add((new ClinicIssuesRow({
                    doctorName: element.doctor.firstName + " " + element.doctor.lastName,
                    doctor: element.doctor._id,
                    issue: element.issue
                })));
            });
		},
		getDataForReport: function(){
			var result = [];
			_.each(this.models,function(element,index,array){
                    var dataMember = {
                        doctor: element.get('doctor'),
                        issue: element.get('issue')
                    };
                    result.push(dataMember);
                });
			return result;
		},
		total: function() {
			this._total = 0;
			var self = this;
			_.each(this.filterInvalidRows(),function(row, i,data) {
				 self._total+= parseInt(row.get("issue"),10);
			});
			return this._total;
		},
		filterInvalidRows: function(){
			return _.reject(this.models,function(element){return !element.isValid(true)});
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

	return ClinicIssuesRowList

});
