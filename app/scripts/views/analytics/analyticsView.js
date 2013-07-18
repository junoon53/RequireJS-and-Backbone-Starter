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
    'text!templates/analyticsView.html',
    'text!templates/clinicsListRow.html',
         

    ], function(Backbone,$,_,utility,vent,

        Analytics,
        roles,
        
        Loading,
        Finances,
        Patients,
        
        template,clinicsListRowTemplate){

    var _instance = null;

    var AnalyticsView  = Backbone.View.extend({
        model: new Analytics(),
        events: {
            'click .clinicsList li a': 'handleClinicSelect',

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
	           	view.model.fetchAndParseGraphData();
                if(callback) callback();
            });
        },
        onClose: function(){
            this.removeAllGraphsViews();
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
                	view.model.fetchAndParseGraphData();
                })
                
            }                      
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