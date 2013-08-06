define([

    'backbone',
    'jquery', 
    'underscore',
    'utility',
    'vent',
    
    'models/analytics/analytics',
    'models/formModels/people/roles',

    'views/loading',
    'views/analytics/graphViews/finances',
    'views/analytics/graphViews/patients',
    'views/analytics/graphViews/revenuePerDoctor',
    'text!templates/analyticsView.html',
    'text!templates/clinicsListRow.html',
         

    ], function(Backbone,$,_,utility,vent,

        Analytics,
        roles,
        
        Loading,
        Finances,
        Patients,
        RevenuePerDoctor,
        
        template,clinicsListRowTemplate){

    var _instance = null;

    var AnalyticsView  = Backbone.View.extend({
        model: new Analytics(),
        events: {
            'click .clinicsList li a': 'handleClinicSelect',
            'click  li#refresh a': 'handleRefreshClick',
            'changeDate #fromDatetimepicker' : 'handleFromDateChange',
            'changeDate #toDatetimepicker' : 'handleToDateChange',

        },
        initialize: function(){
            var self = this;
            this.model = new Analytics();
            this.template = _.template(template);
            this.clinicsListRowTemplate = _.template(clinicsListRowTemplate);

            this.graphViews = [];
        },
        _animateAndAppendSubView: function(callback, view){
            var self = this;
            this.$(".graphs-container").append(view.el);
            //view.$el.show();

            view.$el.fadeIn(1000, function(){
                view.$el.show();
	           	view.model.fetchAndParseGraphData(self.model.get('fromDate'),self.model.get('toDate'));
                if(callback) callback();
            });
        },
        onClose: function(){
            this.removeAllGraphsViews();
            this.fromDateTimePicker.destroy();
            this.toDateTimePicker.destroy();
        },
        handleFromDateChange : function(ev) {
            ev.preventDefault();
            this.fromDateTimePicker.hide();
            var self = this;
            if(!utility.areSameDate(ev.localDate,this.model.get('fromDate'))){
                this.model.set("fromDate",ev.localDate);
                //this.model.fetchAndParseGraphData();
                //this.showLoadingGif();
                this.graphViews.forEach(function(view){
                    view.model.fetchAndParseGraphData(self.model.get('fromDate'),self.model.get('toDate'));
                });

            }
        }, 
        handleToDateChange : function(ev) {
            ev.preventDefault();
            this.toDateTimePicker.hide();
            var self = this;
            if(!utility.areSameDate(ev.localDate,this.model.get('toDate'))){
                this.model.set("toDate",ev.localDate);
                //this.model.fetchAndParseGraphData();
                //this.showLoadingGif();
                this.graphViews.forEach(function(view){
                    view.model.fetchAndParseGraphData(self.model.get('fromDate'),self.model.get('toDate'));
                });

            }
        },
        showLoadingGif: function() {
            this.$(".graphs-container").html(Loading.$el);
        },
        removeAllGraphsViews: function() {
        	var numGraphViews = this.graphViews.length;
        	for(var i=0;i<numGraphViews;i++) {
        		this.graphViews.pop().close();
        	}
        },	
        loadGraphViews: function() {
        	this.$(".graphs-container").html("");

        	var finances = new Finances();
        	finances.render();
        	this.graphViews.push(finances);
        	this._animateAndAppendSubView(null,finances);

            var patients = new Patients();
            patients.render();
            this.graphViews.push(patients);
            this._animateAndAppendSubView(null,patients);

        	var revenuePerDoctor = new RevenuePerDoctor();
        	revenuePerDoctor.render();
        	this.graphViews.push(revenuePerDoctor);
        	this._animateAndAppendSubView(null,revenuePerDoctor);

        },
        handleClinicSelect: function(ev){
            ev.preventDefault();
            var self = this;
            var selectedClinicId = parseInt(ev.currentTarget.id,10);
            if(selectedClinicId !== this.model.get('clinic')) {

            	if(selectedClinicId !== -1){            		
	                this.model.set({clinicName:_.findWhere(this.model.get('clinics'),{_id:selectedClinicId}).name});	                
            	} else {
            		this.model.set({clinicName:"All Clinics"});
            	}
            	this.model.set({clinic:selectedClinicId});
            	this.$('span.selectedClinic').attr('id',this.model.get('clinic'));
                this.$('span.selectedClinic').text(this.model.get('clinicName'));  

                this.graphViews.forEach(function(view){
                	view.model.set('clinic',self.model.get('clinic'));
                	view.model.fetchAndParseGraphData(self.model.get('fromDate'),self.model.get('toDate'));
                })
                
            }                      
        },
        handleRefreshClick: function(Ev){
            this.removeAllGraphsViews();
            this.loadGraphViews();
        },
        render: function() {
        	var self = this;
            this.$el.html(this.template(this.model.toJSON()));   
            this.showLoadingGif();

             var clinicsList = "";
            _.each(this.model.get('clinics'),function(element,index,array){
                clinicsList += self.clinicsListRowTemplate({clinicName:element.name,clinic:element._id});
            });
            clinicsList += self.clinicsListRowTemplate({clinicName:"All Clinics",clinic:-1});

            this.$('.clinicsList').html(clinicsList);  

             this.$('#fromDatetimepicker').datetimepicker({
              pickTime: false
            });
            this.fromDateTimePicker = this.$('#fromDatetimepicker').data('datetimepicker');
            this.fromDateTimePicker.setLocalDate(this.model.get('fromDate'));

            this.$('#toDatetimepicker').datetimepicker({
              pickTime: false
            });
            this.toDateTimePicker = this.$('#toDatetimepicker').data('datetimepicker');
            this.toDateTimePicker.setLocalDate(new Date(this.model.get("toDate")));

            this.loadGraphViews();
        }

    });

    /*function getInstance() {
        if(_instance === null) {
          _instance = new AnalyticsView();
          _instance.render();  
        } 
        return _instance;
    }
*/

    return AnalyticsView;

});