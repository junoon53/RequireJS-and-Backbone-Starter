define(['models/analytics/graphViewModel','config','utility','vent'], function(Graph,config,utility,vent) {
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
        	var revenueData = [];
        	var expenditureData = [];
        	var xAxisTicks = [];
        	var i = 0;

        	while(start < end){
		       var tick = utility.getShortDate(start);
		       revenueData.push([i,0]);
		       expenditureData.push([i,0]);
		       xAxisTicks.push([i,start.getDate()+"|"+start.getMonth()]);
		       start.setDate(start.getDate() + 1)
		       i++;
		    }
		    this.set('xAxisTicks',xAxisTicks);

        	$.get(config.serverUrl+'revenue',{fromDate: this.get('fromDate'),toDate:this.get('toDate'),clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        revenueData.forEach(function(element,index){
			        	var total = 0;
			        	if(data[index]) {
				        	data[index].revenue.forEach(function(revenue){
				        		total+=revenue.amount;
				        	});
				        	revenueData[index][1] = total;
			        	}
			        });

			        self.set('revenueData',revenueData);
			        vent.trigger('CDF.Models.Analytics.GraphModels.FinanceGraphModel.fetchAndParseGraphData:revenue');
			    }
			
			});

			$.get(config.serverUrl+'expenditure',{fromDate: this.get('fromDate'),toDate:this.get('toDate'),clinic:this.get('clinic')},function(data){
		    	if(data.length) {
			        expenditureData.forEach(function(element,index){
			        	var total = 0;
			        	if(data[index]){
				        	data[index].expenditure.forEach(function(expenditure){
				        		total+=expenditure.amount;
				        	});
				        	expenditureData[index][1] = total;
			        	}
			        });

			        self.set('expenditureData',expenditureData);
			        vent.trigger('CDF.Models.Analytics.GraphModels.FinanceGraphModel.fetchAndParseGraphData:expenditure');
			    }
			
			});
        }
    });

    return FinanceGraphModel;
});