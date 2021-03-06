define(['backbone','underscore','jquery','models/analytics/graphViewModel','config','utility','vent'], function(Backbone,_,$,Graph,config,utility,vent) {
    var _instance = null;

    var RevenuePerDoctorGraphModel = Graph.extend({
        url: '',
        defaults: {
        	clinic: 0,
        	revenueData: [],
        	xAxisTicks: [],
        },
        initialize: function(){
           var self = this;
       
        },
        fetchAndParseGraphData: function(fromDate,toDate) {
        	var self = this;
        	var start  = new Date(new Date(fromDate).getTime());
        	var end = toDate;
        	var revenueData = {};
        	var xAxisTicks = [];
        	var doctorCount = 0;

        	$.get(config.serverUrl+'revenue',{fromDate: fromDate,toDate:toDate,clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        data.forEach(function(element,index){
			        	var total = 0;
			        	element.revenue.forEach(function(revenue){
			        		if(!revenueData[revenue.doctor.id]) {
			        			revenueData[revenue.doctor.id] = [doctorCount+1,0];
			        			xAxisTicks[doctorCount+1] = [doctorCount+1,revenue.doctor.id];
			        			doctorCount++;
			        		}
			        		revenueData[revenue.doctor.id][1]+= revenue.amount;
			        	});
			        });

			        self.set('xAxisTicks',xAxisTicks);
			        self.set('revenueData',_.values(revenueData));
			        vent.trigger('CDF.Models.Analytics.GraphModels.RevenuePerDoctorGraphModel.fetchAndParseGraphData:revenue');
			    }
			
			});

        }
    });

    return RevenuePerDoctorGraphModel;
});