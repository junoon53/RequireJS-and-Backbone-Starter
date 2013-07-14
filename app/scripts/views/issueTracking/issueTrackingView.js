define([

    'backbone',
    'jquery', 
    'underscore',
    'utility',
    
    'collections/issueTracking/issues',
    'models/issueTracking/issue',
    'models/formModels/people/roles',
    'models/issueTracking/issueTracking',
    'views/issueTracking/issueRow',
    'vent',
    'text!templates/issueTrackingView.html',
    'text!templates/clinicsListRow.html',
    'text!templates/issueTrackingRow.html',
    'datetimepicker',
         

    ], function(Backbone,$,_,utility,
        IssuesCollection,
        Issue,
        roles,
        IssueTracking,
        IssueRow,
        vent,template,clinicsListRowTemplate,rowTemplate){

    var _instance = null;

    var IssueTrackingView  = Backbone.View.extend({
        model: new IssueTracking(),
        collection: new IssuesCollection(),
        events: {
            'click .clinicsList li a': 'handleClinicSelect',
            'changeDate #fromDatetimepicker' : 'handleFromDateChange',
            'changeDate #toDatetimepicker' : 'handleToDateChange',
            'click .hideCompletedIssues' : 'toggleCompletedIssues'
            //'click th.priority' : 'sortRows',
            //'click th.status' : 'sortRows'
        },
        initialize: function(){
            var self = this;
            this.model = new IssueTracking();
            this.collection = new IssuesCollection();
            this.template = _.template(template);
            this.rowTemplate = _.template(rowTemplate);
            this.clinicsListRowTemplate = _.template(clinicsListRowTemplate);

            this.rowViews = [];

            this.listenTo(this.collection,'reset' , this.removeAllRowViews); 
            this.listenTo(vent,'Collections.IssueTracking.Issues:fetchIssues:success',this.populateTable);
            this.listenTo(vent,'Views.IssueTracking.IssueRowView:setStatus:complete',this.hideCompletedIssue);
            //this.listenTo(this.collection,'add', this.addRow);
        },
        fetchIssues: function() {
            this.collection.reset();
            this.collection.fetchIssues(this.model.get('fromDate'),this.model.get('toDate'),this.model.get('clinic'));
        },
        handleFromDateChange : function(ev) {
            ev.preventDefault();
            this.model.set("fromDate",ev.localDate);
            this.fromDateTimePicker.hide();
            this.fetchIssues();
        }, 
        handleToDateChange : function(ev) {
            ev.preventDefault();
            this.model.set("toDate",ev.localDate);
            this.toDateTimePicker.hide();
            this.fetchIssues();
        },
        handleClinicSelect: function(ev){
            ev.preventDefault();
            var selectedClinicId = parseInt(ev.currentTarget.id,10);
            if(selectedClinicId !== this.model.get('clinic')) {
                this.model.set({clinic:selectedClinicId});
                this.model.set({clinicName:_.findWhere(this.model.get('clinics'),{_id:selectedClinicId}).name});
                this.$('span.selectedClinic').attr('id',this.model.get('clinic'));
                this.$('span.selectedClinic').text(this.model.get('clinicName'));  
                this.fetchIssues();
            }                      
        }, 
        hideCompletedIssue: function(view) {
            if($('input.hideCompletedIssues').is(":checked")) view.$el.hide();
        },
        toggleCompletedIssues: function(){

             if($('input.hideCompletedIssues').is(":checked")) {
                this.rowViews.forEach(function(view){
                    if(view.model.get('status') === "complete") $(view.el).hide();
                });
             } else {
                this.rowViews.forEach(function(view){
                    $(view.el).show();
                });
             }
        },
        onClose: function(){
            this.fromDateTimePicker.destroy();
            this.toDateTimePicker.destroy();
            this.removeAllRowViews();
        },
        sortRows : function(ev) {
            ev.preventDefault();
            var targetClass = ev.currentTarget.className.split(" ")[0];

            switch(targetClass) {
                case "priority":
                    this.collection.comparator = this.collection.priorityComparator;
                    break;
                case "status":
                    this.collection.comparator = this.collection.statusComparator;
                    break;
            }
            this.fetchIssues();
        },
        populateTable: function() {
            var self = this;
            var models =  this.collection.models;
            models.forEach(function(model){self.addRow(model)});
            this.toggleCompletedIssues();
        },
        addRow: function(rowModel){     

            rowModel.set('date',utility.getLongDate(new Date(rowModel.get('date'))));
            rowModel.set('dueDate',new Date(rowModel.get('dueDate')));

            var rowView = new IssueRow({model: rowModel});
            rowView.render();               

            this.rowViews.push(rowView);
            this.$('.issuesTableBody').append((rowView.$el));
        },
        removeAllRowViews: function() {
            //this.$('#rows-container').html('');
            for(var i=0;i<this.rowViews.length;i++){
                this.rowViews[i].close();
            }
        },
        render: function(){
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));   
          
            var clinicsList = "";
            _.each(this.model.get('clinics'),function(element,index,array){
                clinicsList += self.clinicsListRowTemplate({clinicName:element.name,clinic:element._id});
            });

            this.$('.clinicsList').html(clinicsList);  

            this.$('#fromDatetimepicker').datetimepicker({
              pickTime: false
            });
            this.fromDateTimePicker = this.$('#fromDatetimepicker').data('datetimepicker');
            this.fromDateTimePicker.setLocalDate(new Date(this.model.get("date")));

            this.$('#toDatetimepicker').datetimepicker({
              pickTime: false
            });
            this.toDateTimePicker = this.$('#toDatetimepicker').data('datetimepicker');
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