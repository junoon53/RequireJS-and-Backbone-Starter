define([

    'backbone',
    'jquery', 
    'underscore',
    
    'models/app',
    'models/formModels/people/roles',
    
    'views/formViews/feedbackForm',
    'views/issueTracking/issueTrackingView',
    'views/analytics/analyticsView',

    'router/router',
    'vent',
    'text!templates/app.html',

    ], function(Backbone,$,_,
        App,
        roles,

        FeedbackForm,
        IssueTracking,
        Analytics,

        router,vent,template){

    var _instance = null;

    var AppView  = Backbone.View.extend({
        model: new App(),
        events: {
            'click li#feedbackForm': 'handleMainMenuClick',
            'click li#issueTracking': 'handleMainMenuClick',
            'click li#analytics': 'handleMainMenuClick',
            'click li#logout a': 'handleLogoutClick',
        },
        initialize: function(){
            var self = this;
            this.model = new App();
            this.template = _.template(template);

            this.activeViews = {};
            this.selectedViewType = null;

        },
        unselectAllMenuItems: function(){
           this.$('ul.nav-tabs li').each(function(index){
                $(this).removeClass('active');
            });
        },
        changeMenuSelection: function(selection) {
            this.unselectAllMenuItems();

            if(selection) {
                this.$('ul.nav-tabs li#'+selection).attr("class","active");               
            }
        },
        onClose: function(){

            _.each(this.activeViews,function(element,index,data){
                element.close();
                element = null;               
            });    
            
        },
        hideAllViews: function(){

            _.each(this.activeViews,function(element,index,data){
                element.$el.hide();
            });    

        },
        render: function(){
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));   
          
            return this;
        },
        showView: function(viewType){

            // hide all views
            this.hideAllViews();
            this.activeViews[viewType].$el.show();
            this.selectedViewType = viewType;

        },
        refreshSelectedView: function(reportExists){
            if(this.selectedViewType !== null && reportExists) {
                this.createAndRenderView(this.selectedViewType);
                this.activeViews[this.selectedViewType].$el.show();
            }
        },
        addRetrievedViews: function(reportExists) {
            var self = this;
            //this.model.resetReport();
            self.removeAllViews();
            _.each(this.model.viewTypes(),function(viewType){
                self.createAndRenderView(viewType);
            });

            if(this.selectedViewType !== null) {
                this.activeViews[this.selectedViewType].$el.show();
            }

        },
        removeAllViews: function(){
            _.each(this.activeViews, function(value,key,list){
                value.close();  
            });
            this.activeViews = {};
            this.$('#appContent').html('');
            this.$('.alert-error-global').hide();
        },
        createAndRenderView: function(viewType) {
            var self = this;
            if(!this.activeViews[viewType]) {
                switch(viewType){
                    case 'feedbackForm':
                        this.activeViews[viewType] = new FeedbackForm();
                        this.activeViews[viewType].model.set({date:this.model.get('date'),
                            clinics:this.model.get('clinics'),
                            clinic:this.model.get('clinic'),
                            reportExists:this.model.get('reportExists'),
                            clinicName:this.model.get('clinicName'),
                            role:this.model.get('role'),
                            user:this.model.get('user')

                        });
                        break;
                    case 'issueTracking':
                        this.activeViews[viewType] = new IssueTracking();
                        this.activeViews[viewType].model.set({
                            clinics:this.model.get('clinics'),
                            clinic:this.model.get('clinic'),
                            clinicName:this.model.get('clinicName'),
                            toDate:this.model.get('date'),
                        });
                        var fromDate = new Date(this.model.get('date'));
                        fromDate.setDate(fromDate.getDate()-30);
                        
                        this.activeViews[viewType].fetchIssues();                        
                        break;
                    case 'analytics':
                        this.activeViews[viewType] = new Analytics();
                        this.activeViews[viewType].model.set({
                           
                            clinics:this.model.get('clinics'),
                            clinic:this.model.get('clinic'),
                            clinicName:this.model.get('clinicName'),
                            toDate:this.model.get('date'),
                        });
                        var fromDate = new Date(this.model.get('date'));
                        fromDate.setDate(fromDate.getDate()-30);
                        this.activeViews[viewType].model.set('fromDate',fromDate);
                        break;
                } 

                this.activeViews[viewType].render();     
                this.$("#appContent").append(this.activeViews[viewType].$el);     
                this.activeViews[viewType].$el.hide();          

                switch(this.model.get('role')){
                    case _.findWhere(roles().attributes,{name:'DOCTOR'})._id:                        
                    case _.findWhere(roles().attributes,{name:'CONSULTANT'})._id:                        
                    case _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id: 
                        break;
                }
                
            } 
        },
        handleMainMenuClick: function(ev) {
            ev.preventDefault();
            var viewType = ev.currentTarget.id;
            this.addView(viewType);         
        },
        addView: function(viewType) {
            this.changeMenuSelection(viewType);
            this.createAndRenderView(viewType);  
            this.showView(viewType); 
        },
        handleLogoutClick: function(ev){
            ev.preventDefault();
             vent.trigger('CDF.Views.AppView:handleLogoutClick');
             router.on();
        }

    });

    return AppView;

});