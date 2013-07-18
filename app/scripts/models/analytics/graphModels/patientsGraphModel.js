define(['underscore','jquery','models/analytics/graphViewModel','config','utility','vent'], function(_,$,Graph,config,utility,vent) {
    var _instance = null;

    var PatientsGraphModel = Graph.extend({
        url: '',
        defaults: {
        	fromDate: new Date(),
        	toDate: new Date(),
        	clinic: 0,
        	allPatientsData: [],
        	newPatientsData: [],
        	xAxisTicks: [],
        	drawAllPatientsGraph: true,
        	drawNewPatientsGraph: true
        },
        initialize: function(){
           var self = this;
        },
        fetchAndParseGraphData: function() {
        	var self = this;
        	var start  = new Date(this.get('fromDate'));
        	var end = new Date(this.get('toDate'));
        	var allPatientsData = [];
        	//var newPatientsData = [];
        	var xAxisTicks = [];
        	var i = 0;

        	while(start < end){
		       var tick = utility.getShortDate(start);
		       allPatientsData.push([i,0]);
		       //newPatientsData.push([i,0]);
		       xAxisTicks.push(start.getDate()+"|"+(start.getMonth()+1));
		       start.setDate(start.getDate() + 1)
		       i++;
		    }
		    

        	$.get(config.serverUrl+'treatmentsData',{fromDate: this.get('fromDate'),toDate:this.get('toDate'),clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        xAxisTicks.forEach(function(element,index){
			        	var total = 0;
			        	var uniquePatients = {};
			        	if(data[index]) {
				        	data[index].treatments.forEach(function(treatment){
				        		uniquePatients[treatment.patient]+=1;
				        	});
				        	allPatientsData[index][1] = _.keys(uniquePatients).length;
			        	}
			        });

			        self.set('allPatientsData',allPatientsData);
			        vent.trigger('CDF.Models.Analytics.GraphModels.PatientsGraphModel.fetchAndParseGraphData:allPatients');
			    }
			
			});

        	this.set('xAxisTicks',xAxisTicks);
/*			$.get(config.serverUrl+'newPatients',{fromDate: this.get('fromDate'),toDate:this.get('toDate'),clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        newPatientsData.forEach(function(element,index){
			        	var total = 0;
			        	if(data[index]){
				        	data[index].newPatients.forEach(function(newPatients){
				        		total+=newPatients.amount;
				        	});
				        	newPatientsData[index][1] = total;
			        	}
			        });

			        self.set('newPatientsData',newPatientsData);
			        vent.trigger('CDF.Models.Analytics.GraphModels.PatientsGraphModel.fetchAndParseGraphData:newPatients');
			    }
			
			});
*/
        }
    });

    return PatientsGraphModel;
});