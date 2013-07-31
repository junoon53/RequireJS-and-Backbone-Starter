define(['backbone','underscore','jquery','models/analytics/graphViewModel','config','utility','vent'], function(Backbone,_,$,Graph,config,utility,vent) {
    var _instance = null;

    var FinanceGraphModel = Graph.extend({
        url: '',
        defaults: {
        	fromDate: new Date(),
        	toDate: new Date(),
        	clinic: 0,
        	revenueData: [],
        	expenditureData: [],
        	xAxisTicks: [],
        	drawRevenueGraph: true,
        	drawExpenditureGraph: true
        },
        initialize: function(){
           var self = this;
       
        },
        fetchAndParseGraphData: function() {
        	var self = this;
        	var start  = new Date(this.get('fromDate'));
        	var end = new Date(this.get('toDate'));
        	var revenueData = {};
        	var expenditureData = {};
        	var xAxisTicks = [];
        	var i = 0;

        	while(start < end){
		       var tick = utility.getShortDate(start);
		       var dateString = start.getDate()+"|"+(start.getMonth()+1)+"|"+start.getFullYear();
			   var shortDateString = start.getDate()+"|"+(start.getMonth()+1);

		       revenueData[dateString] = [i,0];
		       expenditureData[dateString] = [i,0];
		       xAxisTicks.push([i,shortDateString]);
		       start.setDate(start.getDate() + 1);
		       i++;
		    }
		    this.set('xAxisTicks',xAxisTicks);

        	$.get(config.serverUrl+'revenue',{fromDate: this.get('fromDate'),toDate:this.get('toDate'),clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        data.forEach(function(element,index){
			        	var total = 0;
			        	element.revenue.forEach(function(revenue){
			        		total+=revenue.amount;
			        	});
			        	var date = new Date(element.date);
			        	var dateString = date.getDate()+"|"+(date.getMonth()+1)+"|"+date.getFullYear();
			        	if(revenueData[dateString]) revenueData[dateString][1] = total;
			        });

			        self.set('revenueData',_.values(revenueData));
			        vent.trigger('CDF.Models.Analytics.GraphModels.FinanceGraphModel.fetchAndParseGraphData:revenue');
			    }
			
			});

			$.get(config.serverUrl+'expenditure',{fromDate: this.get('fromDate'),toDate:this.get('toDate'),clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        data.forEach(function(element,index){
			        	var total = 0;
			        	element.expenditure.forEach(function(expenditure){
			        		total+=expenditure.amount;
			        	});
			        	var date = new Date(element.date);
			        	var dateString = date.getDate()+"|"+(date.getMonth()+1)+"|"+date.getFullYear();
			        	if(expenditureData[dateString]) expenditureData[dateString][1] = total;
			        });

			        self.set('expenditureData',_.values(expenditureData));
			        vent.trigger('CDF.Models.Analytics.GraphModels.FinanceGraphModel.fetchAndParseGraphData:expenditure');
			    }
			
			});
        }
    });

    return FinanceGraphModel;
});