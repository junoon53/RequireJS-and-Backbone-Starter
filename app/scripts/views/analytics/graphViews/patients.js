define([
	'utility',
	'vent',
    'views/analytics/graphView',
    'models/analytics/graphModels/patientsGraphModel',
    'text!templates/patientsGraphView.html',
    'flot',

    ], function(utility,vent,GraphView,PatientsGraphModel,template){

    var PatientsView  = GraphView.extend({
    	className:'row-fluid patients-graph ',
        events: {
        	//'click .button-allPatients-graph' : 'handleAllPatientsClick',
        	//'click .button-newPatients-graph' : 'handleNewPatientsClick',
        },
        initialize: function(){
            var self = this;
            this.model = new PatientsGraphModel();
            this.template = _.template(template);

            var fromDate = new Date(this.model.get('fromDate'));
            fromDate.setDate(fromDate.getDate()-30);
            this.model.set('fromDate',fromDate);

          	this.listenTo(vent,'CDF.Models.Analytics.GraphModels.PatientsGraphModel.fetchAndParseGraphData:allPatients',this.plotGraph);
        	this.listenTo(vent,'CDF.Models.Analytics.GraphModels.PatientsGraphModel.fetchAndParseGraphData:newPatients',this.plotGraph);
        },
        plotGraph: function() {
        	var self = this
        	var data = [];
        	if(this.model.get('drawAllPatientsGraph')) data.push({ data: this.model.get('allPatientsData'), label: "All Patients :"+this.model.get('totalPatients')});
        	//if(this.model.get('drawNewPatientsGraph')) data.push({ data: this.model.get('NewPatientsData'), label: "NewPatients"});


        	var options  = {
				   series: {
					   bars: { show: true,
								lineWidth: 0,
                                'align': "center",
                                barWidth : 0.5,
								fill: true, fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] }
							 },
					   points: { show: false, 
								 lineWidth: 2 
							 },
					   shadowSize: 0
				   },
				   grid: { hoverable: true, 
						   clickable: true, 
						   tickColor: "#f9f9f9",
						   borderWidth: 0
						 },
				 legend: {
						    show: true
						},	
				   colors: ["#FA5833","#bdea74","#2FABE9","#eae874"   ],
					xaxis: {ticks: self.model.get('xAxisTicks')},
					yaxis: {ticks:5, tickDecimals: 0},
				 };

        	if(data.length === 0) {
        		$.plot(this.$('.graph-container'),[],options);
        		return;
        	}
			
			$.plot(this.$(".graph-container"), data,options);

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
					}else {
						$("#tooltip").remove();
						previousPoint = null;
					}
			});
        }
    });

    return PatientsView;

});