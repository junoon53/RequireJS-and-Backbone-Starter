define([

    'backbone',
    'jquery', 
    'underscore',
    'models/people/person',
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
    'text!templates/clinicsListRow.html',
    'datetimepicker',
         

    ], function(Backbone,$,_,Person,Modal,RevenueRowList,AddDoctor,AddPatient,RevenueTableView,ModalView,Submit,router,vent,template,clinicsListRowTemplate){

    var appView  = Backbone.View.extend({
        events: {
            'click li#revenue a': 'addRevenueTableView',
            'click li#submit a': 'handleSubmitClick',
            'click li#logout a': 'handleLogoutClick',
            'click .clinicsList li a': 'handleClinicSelect',
            'changeDate #datetimepicker' : 'changeDate'

        },
        initialize: function(){
            var self = this;
            this.template = _.template(template);
            this.$el.html(this.template(this.model.toJSON()));   

            this.clinicsListRowTemplate = _.template(clinicsListRowTemplate);

            var clinicsList = "";
            _.each(this.model.get('clinics'),function(element,index,array){
                clinicsList += self.clinicsListRowTemplate({clinicName:element.name,clinicId:element._id});
            });

            this.$('.clinicsList').html(clinicsList);


            this.$('#datetimepicker').datetimepicker({
              pickTime: false
            });

            this.router = new router();

            this.activeViews = {};

            /*this.defaultView = "<h3>Welcome! Please choose an option on the left!</h3>";
            this.$("#content").append(this.defaultView);*/

            this.dateTimePicker = this.$('#datetimepicker').data('datetimepicker');
            this.listenTo(vent,"CDF.Models.Application:checkReportStatus", this.showReportExistsWarning);
            this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.Utility.Modal:hide', this.displayModal);
        },
        handleClinicSelect: function(evt){
            var selectedClinicId = parseInt(evt.currentTarget.id,10);
            if(selectedClinicId !== this.model.get('clinicId')) {
                this.model.set({clinicId:selectedClinicId});
                this.model.set({clinicName:_.findWhere(this.model.get('clinics'),{_id:selectedClinicId}).name});
                this.$('a.selectedClinic').attr('id',this.model.get('clinicId'));
                this.$('a.selectedClinic').text(this.model.get('clinicName'));  
                this.removeAllViews(); 
            }                      
        },
        changeMenuSelection: function(selection) {
            this.$('ul.nav-list li').each(function(index){
                $(this).removeAttr('class');
            })

            if(selection)
             this.$('ul.nav-list li#'+selection).attr("class","active");
        },
        onClose: function(){
            this.dateTimePicker.destroy();

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
            var addDoctorView = new AddDoctor({model: new Person({
                                                                    firstName:names[0],
                                                                    lastName:names[1],
                                                                    isActive:1,
                                                                    clinics:[this.model.get("clinicId")],
                                                                    roles: [0]
                                                                })});       
            var modalModel = new Modal({header:"Add Doctor",footer:"",body:addDoctorView.$el});
            var modal = new ModalView({model:modalModel});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddPatientModal: function(msg){
            var names = msg.patientNameString.split(" ");
            var addPatientView = new AddPatient({model: new Person({
                                                                     firstName:names[0],
                                                                     lastName:names[1],
                                                                     isActive:1,
                                                                     clinics:[this.model.get("clinicId")],
                                                                     roles: [4]
                                                                 })});       
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
            this.showView(view);
        },
        showView: function(view){

            // hide all views
            this.hideAllViews();
            view.$el.show();

        },
        removeAllViews: function(){
            _.each(this.activeViews, function(value,key,list){
                value.close();  
            });
            this.activeViews = {};
            this.$('#content').html('');
            this.changeMenuSelection();
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
           
            this.changeMenuSelection('revenue');

            if(!this.activeViews.revenue) {
                this.activeViews.revenue = new RevenueTableView({model: new RevenueRowList()});

                switch(this.model.get('roleId')){
                    case 0:                        
                        break;
                    case 1:
                        this.activeViews.revenue.getRevenueOnDate(this.model.get('date'),this.model.get('clinicId')); 
                        break;
                }
                this.addView(this.activeViews.revenue);                
            } else {
                this.showView(this.activeViews.revenue);
            }
                
           
        },
        handleSubmitClick: function(){
              var modalModel = new Modal({header:"Submit Report",footer:(new Submit()).$el,body:"Phew! That was a lot of work! Well, looks like we're ready to submit! Do check if your inputs are correct before pressing the button."});
              var modal = new ModalView({model:modalModel});
              this.addAlertView(modal);
              modal.show();
        },
        handleLogoutClick: function(){
             vent.trigger('CDF.Views.AppView:handleLogoutClick');
             this.router.index();
        },

    });

    return appView;

});