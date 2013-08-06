define([
	'utility',
	'vent',
    'views/analytics/graphView',
    'models/analytics/graphModels/financeGraphModel',
    'text!templates/financesGraphView.html',
    'flot',

    ], function(utility,vent,GraphView,FinanceGraphModel,template){

    var FinancesView  = GraphView.extend({
    	className:'row-fluid finance-graph ',
        events: {
        	//'click .button-revenue-graph' : 'handleRevenueClick',
        	//'click .button-expenditure-graph' : 'handleExpenditureClick',
        },
        initialize: function(){
            var self = this;
            this.model = new FinanceGraphModel();
            this.template = _.template(template);

          	this.listenTo(vent,'CDF.Models.Analytics.GraphModels.FinanceGraphModel.fetchAndParseGraphData:revenue',this.plotGraph);
        	this.listenTo(vent,'CDF.Models.Analytics.GraphModels.FinanceGraphModel.fetchAndParseGraphData:expenditure',this.plotGraph);
        },      
        plotGraph: function() {
        	var self = this
        	var data = [];
            //var options = [];
        	if(this.model.get('drawRevenueGraph')) {
                data.push({ data: this.model.get('revenueData'), label: "Revenue: "+this.model.get('totalRevenue'),
                       lines: { show: true,
                                lineWidth: 2,
                                fill: true, fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] }
                             },
                       points: { show: true, 
                                 lineWidth: 2 
                             },
                       shadowSize: 0,
                   });
                data.push({data: this.model.get('averageRevenueData'),label: "Average Revenue :"+this.model.get('averageRevenue'),
                       lines: { show: true,
                                lineWidth: 1,
                                fill: true, fillColor: { colors: [ { opacity: 0.2 }, { opacity: 0.2 } ] }
                             },
                       points: { show: false, 
                                 lineWidth: 2 
                             },
                       shadowSize: 0,
        
                   });
            }

        	if(this.model.get('drawExpenditureGraph')) data.push({ data: this.model.get('expenditureData'), label: "Expenditure :"+this.model.get('totalExpenditure'),
                       lines: { show: true,
                                lineWidth: 2,
                                fill: true, fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] }
                             },
                       points: { show: true, 
                                 lineWidth: 2 
                             },
                       shadowSize: 0,
                 });

            var options = {
                grid: { hoverable: true, 
                           clickable: true, 
                           tickColor: "#f9f9f9",
                           borderWidth: 0
                         },
                 legend: {
                            show: true
                        },  
                   colors: ["#2FABE9","#2FABE9","#dae874","#bdea74",   "#FA5833"],
                    xaxis: {ticks: self.model.get('xAxisTicks')},
                    yaxis: {ticks:5, tickDecimals: 0},
                 };
             

        	if(data.length === 0) {
        		$.plot(this.$('.graph-container'),[],options);
        		return;
        	}

			$.plot(this.$(".graph-container"),data,options);

			function showTooltip(x, y, contents) {
			$('<div id="tooltip">' + contents + '</div>').css( {
				position: 'absolute',
				display: 'none',
				top: y + 5,
				left: x + 5,
				border: '1px solid #fdd',
				padding: '2px',
				'background-color': '#dfeffc',
				opacity: 0.80
			}).appendTo("body").fadeIn(200);
			}

			var previousPoint = null;
			this.$(".graph-container").bind("plothover", function (event, pos, item) {
				self.$("#x").text(pos.x.toFixed(2));
				self.$("#y").text(pos.y.toFixed(2));

					if (item) {
						if (previousPoint != item.dataIndex) {
							previousPoint = item.dataIndex;

							$("#tooltip").remove();
							var x = (self.model.get('xAxisTicks')[item.datapoint[0]])[1],
								y = item.datapoint[1].toFixed(2);

							showTooltip(item.pageX, item.pageY,
										item.series.label + " on " + x + " = " + y);
						}
					}
					else {
						$("#tooltip").remove();
						previousPoint = null;
					}
			});
        }
    });

    return FinancesView;

});