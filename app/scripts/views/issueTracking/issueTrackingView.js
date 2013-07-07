define([

    'backbone',
    'jquery', 
    'underscore',
    
    'models/formModels/people/roles',
    'models/issueTracking/issueTracking',
    'vent',
    'text!templates/issueTrackingView.html',
    'text!templates/clinicsListRow.html',
    'text!templates/issueTrackingRow.html',
    'datetimepicker',
         

    ], function(Backbone,$,_,
        roles,
        IssueTracking,
        vent,template,clinicsListRowTemplate,rowTemplate){

    var _instance = null;

    var IssueTrackingView  = Backbone.View.extend({
        model: new IssueTracking(),
        events: {
            'click .clinicsList li a': 'handleClinicSelect',
            'changeFromDate #fromDatetimepicker' : 'handleFromDateChange',
            'changeToDate #toDatetimepicker' : 'handleToDateChange'
        },
        initialize: function(){
            var self = this;
            this.model = new IssueTracking();
            this.template = _.template(template);
            this.rowTemplate = _.template(rowTemplate);
            this.clinicsListRowTemplate = _.template(clinicsListRowTemplate);

        },
        handleFromDateChange : function(ev) {
            ev.preventDefault();
            this.model.set("fromDate",ev.localDate);
            this.fromDateTimePicker.hide();
        }, 
        handleToDateChange : function(ev) {
            ev.preventDefault();
            this.model.set("toDate",ev.localDate);
            this.toDateTimePicker.hide();
        },
        handleClinicSelect: function(ev) {
            ev.preventDefault();
        }, 
        onClose: function(){
            this.fromDateTimePicker.destroy();
            this.toDateTimePicker.destroy();

            _.each(this.activeViews,function(element,index,data){
                element.close();
                element = null;               
            });    
            
        },
        render: function(){
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));   
          
            var clinicsList = "";
            _.each(this.model.get('clinics'),function(element,index,array){
                clinicsList += self.clinicsListRowTemplate({clinicName:element.name,clinic:element._id});
            });

            //this.$('.clinicsList').html(clinicsList);  

            this.$('#fromDatetimepicker').datetimepicker({
              pickTime: false
            });
            this.fromDateTimePicker = this.$('#fromDatetimepicker').data('fromDatetimepicker');
            this.toDateTimePicker.setLocalDate(new Date(this.model.get("date")));

            this.$('toDatetimepicker').toDatetimepicker({
              pickTime: false
            });
            this.toDateTimePicker = this.$('#toDatetimepicker').data('toDatetimepicker');
            this.toDateTimePicker.setLocalDate(new Date(this.model.get("date")));

            return this;
        },

    });

    /*function getInstance() {
        if(_instance === null) {
          _instance = new IssueTrackingView();
          _instance.render();  
        } 
        return _instance;
    }
*/

    return IssueTrackingView;

});