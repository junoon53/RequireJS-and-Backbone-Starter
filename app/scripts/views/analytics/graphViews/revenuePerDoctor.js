define([
	'utility',
	'vent',
    'views/analytics/graphView',
    'models/analytics/graphModels/revenuePerDoctorGraphModel',
    'text!templates/revenuePerDoctorGraphView.html',
    'flot',

    ], function(utility,vent,GraphView,RevenuePerDoctorGraphModel,template){

    var RevenuePerDoctorView  = GraphView.extend({
    	className:'row-fluid revenuePerDoctor-graph ',
        events: {

        },
        initialize: function(){
            var self = this;
            this.model = new RevenuePerDoctorGraphModel();
            this.template = _.template(template);

            var fromDate = new Date(this.model.get('fromDate'));
            fromDate.setDate(fromDate.getDate()-30);
            this.model.set('fromDate',fromDate);

          	this.listenTo(vent,'CDF.Models.Analytics.GraphModels.RevenuePerDoctorGraphModel.fetchAndParseGraphData:revenue',this.plotGraph);
        },       
        plotGraph: function() {
        	var self = this
        	var data = [];

            data.push({ data: this.model.get('revenueData'), label: "Revenue By Doctor",
                   bars: { show: true,
                            lineWidth: 0,
                            'align': "center",
                            barWidth : 0.5,
                            fill: true, fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] }
                         },
                   points: { show: false, 
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
                   colors: ["#bdea74",   "#FA5833"],
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
										"Revenue by Dr." + x + " = " + y);
						}
					}
					else {
						$("#tooltip").remove();
						previousPoint = null;
					}
			});
        }
    });

    return RevenuePerDoctorView;

});