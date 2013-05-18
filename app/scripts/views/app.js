define([

    'backbone',
    'jquery', 
    'underscore',
    'models/people/doctor',
    'models/people/patient',
    'models/utility/modal',
    'collections/revenue/revenueRowList',      
    'views/people/addDoctor',
    'views/people/addPatient',
    'views/revenue/revenueTable',
    'views/utility/modal',
    'views/utility/submit',
    'router/router',
    'vent',
    'text!templates/app.html',
    'datetimepicker',
         

    ], function(Backbone,$,_,Doctor,Patient,Modal,RevenueRowList,AddDoctor,AddPatient,RevenueTableView,ModalView,Submit,router,vent,template){

    var appView  = Backbone.View.extend({
        events: {
            'click li#revenue a': 'addRevenueTableView',
            'click li#submit a': 'handleSubmitClick',
            'click li#logout a': 'handleLogoutClick',
            'changeDate #datetimepicker' : 'changeDate'

        },
        initialize: function(){
            var self = this;
            this.template = _.template(template);
            this.$el.html(this.template(this.model.toJSON()));   
            this.$('#datetimepicker').datetimepicker({
              pickTime: false
            });

            /*Application Sub-Views*/
            this.revenueTableView = null;
            this.bankdepositsTableView = null;
            this.expenditureTableView = null;
            this.dentalMaterialsTableView = null;
            this.treatmentsView = null;
            this.patientFeedBackTableView = null;
            this.clinicIssuesView = null;

            this.activeViews = [];

            /*this.defaultView = "<h3>Welcome! Please choose an option on the left!</h3>";
            this.$("#content").append(this.defaultView);*/

            this.dateTimePicker = this.$('#datetimepicker').data('datetimepicker');
            this.listenTo(vent,"CDF.Models.Application:checkReportStatus", this.showReportExistsWarning);
            this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.Utility.Modal:hide', this.displayModal);
        },
        onClose: function(){
            this.dateTimePicker.destroy();

            _.each(this.activeViews,function(element,index,data){
                element.close();
            });    
            
        },
        hideAllViews: function(){

            _.each(this.activeViews,function(element,index,data){
                element.$el.hide();
            });    

        },
        showReportExistsWarning: function(msg){
            if(msg) {

                    console.log('report exists!');
            }
        },
        render: function(){
            
            this.dateTimePicker.setLocalDate(this.model.get("date"));
            return this;
        },
        displayModal: function(modalType){
            switch(modalType){
                case 'reportExistsModal':
                    this.displayReportExistsModal();
                    break;
            }
        },
        displayAddDoctorModal: function(msg){
            var names = msg.doctorNameString.split(" ");
            var addDoctorView = new AddDoctor({model: new Doctor({firstName:names[0],lastName:names[1],active:1,clinics:[this.model.get("clinicId")]})});       
            var modalModel = new Modal({header:"Add Doctor",footer:"",body:addDoctorView.$el});
            var modal = new ModalView({model:modalModel});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddPatientModal: function(msg){
            var names = msg.patientNameString.split(" ");
            var addPatientView = new AddPatient({model: new Patient({firstName:names[0],lastName:names[1]})});       
            var modalModel = new Modal({header:"Add Patient",footer:"",body:addPatientView.$el});
            var modal = new ModalView({model:modalModel});
            this.addAlertView(modal);
            modal.show();
        },
        displayReportExistsModal: function(msg){
            var modalModel = new Modal({header:"Report Exists",footer:"",body:"A report for the selected date has already been submitted. Please choose a different date. To modify an earlier report, contact an administrator."});
            var modal = new ModalView({model:modalModel});
            this.addAlertView(modal);
            modal.show();
        },
        changeDate : function(ev) {
            ev.preventDefault();
            this.model.set("date",ev.localDate);
            this.dateTimePicker.hide();
        },    
        addView: function(view){

            view.render();     
            this.$("#content").append(view.$el);

            // hide all views
            this.hideAllViews();
            view.$el.show();
        },
        addAlertView: function(view){
            if (this.currentAlertView){
              this.currentAlertView.close();
            }
         
            this.currentAlertView = view;
            this.currentAlertView.render();

            this.$("#alert").html(view.$el);             
        },
        addRevenueTableView: function() {
            this.$('ul.nav li#revenue').attr("class","active");
            if(this.revenueTableView === null) {
                this.revenueTableView = new RevenueTableView({model: new RevenueRowList()});
                this.activeViews.push(this.revenueTableView);
            }
                
            this.addView(this.revenueTableView);
        },
        handleSubmitClick: function(){
              var modalModel = new Modal({header:"Submit Report",footer:(new Submit()).$el,body:"Phew! That was a lot of work! Well, looks like we're ready to submit! Do check if your inputs are correct before pressing the button."});
              var modal = new ModalView({model:modalModel});
              this.addAlertView(modal);
              modal.show();
        },
        handleLogoutClick: function(){
             vent.trigger('CDF.Views.AppView:handleLogoutClick');
             router.index();
        },

    });

    return appView;

});