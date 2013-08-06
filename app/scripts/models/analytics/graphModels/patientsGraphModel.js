define(['underscore','jquery','models/analytics/graphViewModel','config','utility','vent'], function(_,$,Graph,config,utility,vent) {
    var _instance = null;

    var PatientsGraphModel = Graph.extend({
        url: '',
        defaults: {
        	clinic: 0,
        	allPatientsData: [],
        	newPatientsData: [],
        	totalPatients: 0,
        	xAxisTicks: [],
        	drawAllPatientsGraph: true,
        	drawNewPatientsGraph: true
        },
        initialize: function(){
           var self = this;
        },
        fetchAndParseGraphData: function(fromDate,toDate) {
        	var self = this;
        	var start  = new Date(new Date(fromDate).getTime());
        	var end = toDate;
        	var allPatientsData = {};
        	var totalPatients = 0;
        	//var newPatientsData = [];
        	var xAxisTicks = [];
        	var i = 0;

        	while(start < end){
		       var tick = utility.getShortDate(start);
		       //newPatientsData.push([i,0]);
		       var dateString = start.getDate()+"|"+(start.getMonth()+1)+"|"+start.getFullYear();
			   var shortDateString = start.getDate()+"|"+(start.getMonth()+1);

		       allPatientsData[dateString] = [i,0];
		       xAxisTicks.push([i,shortDateString]);
		       start.setDate(start.getDate() + 1);
		       i++;
		    }
		    
        	$.get(config.serverUrl+'treatmentsData',{fromDate: fromDate,toDate:toDate, clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        data.forEach(function(element,index){
			        	var treatments = {};
			        	element.treatments.forEach(function(treatment){
			        		treatments[treatment.patient] = true;
			        	});
			   			var date = new Date(element.date);
			        	var dateString = date.getDate()+"|"+(date.getMonth()+1)+"|"+date.getFullYear();
			        	if(allPatientsData[dateString]) allPatientsData[dateString][1] = _.keys(treatments).length;
			        	totalPatients+=_.keys(treatments).length;
			        });

			        self.set('allPatientsData',_.values(allPatientsData));
			        self.set('totalPatients',totalPatients);
			        vent.trigger('CDF.Models.Analytics.GraphModels.PatientsGraphModel.fetchAndParseGraphData:allPatients');
			    }
			});

        	this.set('xAxisTicks',xAxisTicks);
        }
    });

    return PatientsGraphModel;
});