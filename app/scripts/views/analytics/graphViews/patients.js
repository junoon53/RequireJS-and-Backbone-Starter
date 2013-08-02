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
        	'click .button-allPatients-graph' : 'handleAllPatientsClick',
        	'click .button-newPatients-graph' : 'handleNewPatientsClick',
        	'changeDate #fromDatetimepicker' : 'handleFromDateChange',
            'changeDate #toDatetimepicker' : 'handleToDateChange',
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
        handleAllPatientsClick : function(ev) {
        	if(!this.$(ev.target).hasClass('active')) {
        		this.model.set('drawAllPatientsGraph',true);
        	} else {
        		this.model.set('drawAllPatientsGraph',false);
        	}
        	this.model.fetchAndParseGraphData();
        },
        handleNewPatientsClick : function(ev) {
        	if(!this.$(ev.target).hasClass('active')) {
        		this.model.set('drawNewPatientsGraph',true);
        	} else {
        		this.model.set('drawNewPatientsGraph',false);
        	}
        	this.model.fetchAndParseGraphData();
        },
        plotGraph: function() {
        	var self = this
        	var data = [];
        	if(this.model.get('drawAllPatientsGraph')) data.push({ data: this.model.get('allPatientsData'), label: "Patients : "+this.model.get('totalPatients')});
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
/*			var d = [[0, 1000], [1, 2000], [2,4000], [3, 5000], [4, 5000],[5, 1000], [6, 2000], [7,4000], [8, 800], [9, 5500],[10, 1000], [11, 2000], [12,4000], [13, 6000], [14, 3000]];
			var e = [[0,3000],[0,4000],[1,5000],[2,3000][0,3000],[3,3000],[4,6000],[5,3000],[6,4000],[7,0000],[8,8000],[9,4000],[10,1000],[11,5000],[12,3000]];
*/			;
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

    return PatientsView;

});