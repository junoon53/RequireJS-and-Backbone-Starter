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
        	'click .button-revenue-graph' : 'handleRevenueClick',
        	'click .button-expenditure-graph' : 'handleExpenditureClick',
        	'changeDate #fromDatetimepicker' : 'handleFromDateChange',
            'changeDate #toDatetimepicker' : 'handleToDateChange',
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
        handleFromDateChange : function(ev) {
            ev.preventDefault();
            this.fromDateTimePicker.hide();

            if(!utility.areSameDate(ev.localDate,this.model.get('fromDate'))){
                this.model.set("fromDate",ev.localDate);
	           	this.model.fetchAndParseGraphData();
                //this.showLoadingGif();
            }
        }, 
        handleToDateChange : function(ev) {
            ev.preventDefault();
            this.toDateTimePicker.hide();

            if(!utility.areSameDate(ev.localDate,this.model.get('toDate'))){
                this.model.set("toDate",ev.localDate);
                this.model.fetchAndParseGraphData();
                //this.showLoadingGif();

            }
        },
        handleRevenueClick : function(ev) {
        	if(!this.$(ev.target).hasClass('active')) {
        		this.model.set('drawRevenueGraph',true);
        	} else {
        		this.model.set('drawRevenueGraph',false);
        	}
        	this.model.fetchAndParseGraphData();
        },
        handleExpenditureClick : function(ev) {
        	if(!this.$(ev.target).hasClass('active')) {
        		this.model.set('drawExpenditureGraph',true);
        	} else {
        		this.model.set('drawExpenditureGraph',false);
        	}
        	this.model.fetchAndParseGraphData();
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
			$(".graph-container").bind("plothover", function (event, pos, item) {
				$("#x").text(pos.x.toFixed(2));
				$("#y").text(pos.y.toFixed(2));

					if (item) {
						if (previousPoint != item.dataIndex) {
							previousPoint = item.dataIndex;

							$("#tooltip").remove();
							var x = item.datapoint[0].toFixed(2),
								y = item.datapoint[1].toFixed(2);

							showTooltip(item.pageX, item.pageY,
										item.series.label + " of " + x + " = " + y);
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