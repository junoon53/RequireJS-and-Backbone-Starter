define(['backbone','underscore','jquery','models/analytics/graphViewModel','config','utility','vent'], function(Backbone,_,$,Graph,config,utility,vent) {
    var _instance = null;

    var FinanceGraphModel = Graph.extend({
        url: '',
        defaults: {
        	clinic: 0,
        	revenueData: [],
        	expenditureData: [],
        	totalRevenue :0,
        	averageRevenue: 0,
        	averageRevenueData: [],
        	totalExpenditure: 0,
        	averageExpenditure: 0,
        	averageExpData: [],
        	xAxisTicks: [],
        	drawRevenueGraph: true,
        	drawExpenditureGraph: true
        },
        initialize: function(){
           var self = this;
       
        },
        fetchAndParseGraphData: function(fromDate,toDate) {
        	var self = this;
        	var start  = new Date(fromDate.getTime());
        	var end = toDate;
        	var revenueData = {};
        	var expenditureData = {};
        	var totalRevenue = 0;
        	var totalExpenditure = 0;
        	var averageExpenditure = 0;
        	var averageRevenue  = 0;
        	var averageRevenueData = {};
        	var averageExpData = {};
        	var xAxisTicks = [];
        	var dataPoints = 0;
        	var i = 0;

        	while(start <= end){
		       var tick = utility.getShortDate(start);
		       var dateString = start.getDate()+"|"+(start.getMonth()+1)+"|"+start.getFullYear();
			   var shortDateString = start.getDate()+"|"+(start.getMonth()+1);

		       revenueData[dateString] = [i,0];
		       expenditureData[dateString] = [i,0];
		       averageExpData[dateString] = [i,0];
		       averageRevenueData[dateString] = [i,0];
		       xAxisTicks.push([i,shortDateString]);
		       start.setDate(start.getDate() + 1);
		       i++;
		    }
		    dataPoints = i;
		    this.set('xAxisTicks',xAxisTicks);

        	$.get(config.serverUrl+'revenue',{fromDate: fromDate,toDate:toDate,clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        data.forEach(function(element,index){
			        	var total = 0;
			        	element.revenue.forEach(function(revenue){
			        		total+=revenue.amount;
			        	});
			        	var date = new Date(element.date);
			        	var dateString = date.getDate()+"|"+(date.getMonth()+1)+"|"+date.getFullYear();
			        	if(revenueData[dateString]) revenueData[dateString][1] = total;
			        	totalRevenue+=total;
			        });

			        averageRevenue = parseInt(totalRevenue/dataPoints,10);
			        _.values(averageRevenueData).forEach(function(element){
			        	element[1] = averageRevenue;
			        });
			        self.set('averageRevenue',averageRevenue);
			        self.set('totalRevenue',totalRevenue);
			        self.set('revenueData',_.values(revenueData));
			        self.set('averageRevenueData',_.values(averageRevenueData));
			        vent.trigger('CDF.Models.Analytics.GraphModels.FinanceGraphModel.fetchAndParseGraphData:revenue');
			    }
			
			});

			$.get(config.serverUrl+'expenditure',{fromDate: fromDate,toDate:toDate,clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        data.forEach(function(element,index){
			        	var total = 0;
			        	element.expenditure.forEach(function(expenditure){
			        		total+=expenditure.amount;
			        	});
			        	var date = new Date(element.date);
			        	var dateString = date.getDate()+"|"+(date.getMonth()+1)+"|"+date.getFullYear();
			        	if(expenditureData[dateString]) expenditureData[dateString][1] = total;
			        	totalExpenditure+=total;
			        });

			        averageExpenditure += totalExpenditure/dataPoints;
			        self.set('expenditureData',_.values(expenditureData));
			        self.set('totalExpenditure',(totalExpenditure));
			        vent.trigger('CDF.Models.Analytics.GraphModels.FinanceGraphModel.fetchAndParseGraphData:expenditure');
			    }
			
			});
        }
    });

    return FinanceGraphModel;
});