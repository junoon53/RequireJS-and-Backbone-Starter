define([

    'backbone',
    'jquery', 
    'underscore',
    'models/app',
    'models/people/person',
    'models/people/roles',
    'models/utility/modal',

    'models/revenue/revenueRow',
    'collections/revenue/revenueRowList', 
    'models/bankDeposit/bankDepositRow',
    'collections/bankDeposits/bankDepositsRowList',
    'models/expenditure/expenditureRow',
    'collections/expenditure/expenditureRowList',
    'models/patientsFeedback/patientsFeedbackRow',
    'collections/patientsFeedback/patientsFeedbackRowList',
    'models/clinicIssues/clinicIssuesRow',
    'collections/clinicIssues/clinicIssuesRowList',
    'models/dentalMaterials/inventoryRequiredRow',
    'collections/dentalMaterials/inventoryRequiredRowList',

    'views/people/addDoctor',
    'views/people/addPatient',
    'views/people/addPerson',

    'views/revenue/revenueTable',
    'views/bankDeposits/bankDepositsTable',
    'views/expenditure/expenditureTable',
    'views/patientsFeedback/patientsFeedbackTable',
    'views/clinicIssues/clinicIssuesTable',
    'views/inventoryRequired/inventoryRequiredTable',

    'views/utility/modal',
    'views/utility/submit',
    'router/router',
    'vent',
    'text!templates/app.html',
    'text!templates/clinicsListRow.html',
    'datetimepicker',
         

    ], function(Backbone,$,_,app,Person,
        roles,Modal,
        RevenueRow,
        RevenueRowList,
        BankDepositsRow,
        BankDepositsRowList,
        ExpenditureRow,
        ExpenditureRowList,
        PatientsFeedbackRow,
        PatientsFeedbackRowList,
        ClinicIssuesRow,
        ClinicIssuesRowList,
        InventoryRequiredRow,
        InventoryRequiredRowList,

        AddDoctor,
        AddPatient,
        AddPerson,
        RevenueTableView,
        BankDepositsTableView,
        ExpenditureTableView,
        PatientsFeedbackTableView,
        ClinicIssuesTableView,
        InventoryRequiredTableView,

        ModalView,
        Submit,router,vent,template,clinicsListRowTemplate){

    var _instance = null;

    var AppView  = Backbone.View.extend({
        model: app,
        events: {
            'click li#revenue': 'addView',
            'click li#bankDeposits': 'addView',
            'click li#expenditure': 'addView',
            'click li#patientsFeedback': 'addView',
            'click li#clinicIssues': 'addView',
            'click li#inventoryRequired': 'addView',
            'click li#submit a': 'handleSubmitClick',
            'click li#logout a': 'handleLogoutClick',
            'click .clinicsList li a': 'handleClinicSelect',
            'changeDate #datetimepicker' : 'handleDateChange'

        },
        initialize: function(){
            var self = this;
            this.template = _.template(template);
            this.clinicsListRowTemplate = _.template(clinicsListRowTemplate);

            this.activeViews = {};
            this.selectedViewType = null;
            
            this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.BankDeposits.BankDepositsRowView:addNewPerson', this.displayAddPersonModal);
            this.listenTo(vent,'CDF.Views.Expenditure.ExpenditureRowView:addNewPerson', this.displayAddPersonModal);
            this.listenTo(vent,'CDF.Views.PatientsFeedback.PatientsFeedbackRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.ClinicIssues.ClinicIssuesRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.InventoryRequired.InventoryRequiredRowView:addNewExpendableInventoryItem', this.displayAddExpendableInventoryItemModal);


            this.listenTo(vent,'CDF.Views.Utility.Modal:hide', this.displayModal);
            this.listenTo(vent,'CDF.Models.Application:submitReport:failed', this.displayModal);
            this.listenTo(vent,"CDF.Models.Application:submitReport", this.submitReport);            
            this.listenTo(vent,"CDF.Models.Application:broadcastReportStatus", this.refreshSelectedView);            
        },
        handleClinicSelect: function(ev){
            ev.preventDefault();
            var selectedClinicId = parseInt(ev.currentTarget.id,10);
            if(selectedClinicId !== this.model.get('clinic')) {
                this.model.set({clinic:selectedClinicId});
                this.model.set({clinicName:_.findWhere(this.model.get('clinics'),{_id:selectedClinicId}).name});
                this.$('a.selectedClinic').attr('id',this.model.get('clinic'));
                this.$('a.selectedClinic').text(this.model.get('clinicName'));  
                this.removeAllViews(); 
            }                      
        },
        handleDateChange : function(ev) {
            ev.preventDefault();
            this.model.set("date",ev.localDate);
            this.dateTimePicker.hide();
            this.removeAllViews();
        }, 
        changeMenuSelection: function(selection) {
            this.$('ul.nav-list li').each(function(index){
                $(this).removeClass('active');
            })

            if(selection) {
                this.$('ul.nav-list li#'+selection).attr("class","active");               
            }
             
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
        showReportExistsWarning: function(){

            console.log('report exists!');
        },
        render: function(){
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));   
          
            var clinicsList = "";
            _.each(this.model.get('clinics'),function(element,index,array){
                clinicsList += self.clinicsListRowTemplate({clinicName:element.name,clinic:element._id});
            });

            this.$('.clinicsList').html(clinicsList);         
            this.$('#datetimepicker').datetimepicker({
              pickTime: false
            });
            this.dateTimePicker = this.$('#datetimepicker').data('datetimepicker');

            this.dateTimePicker.setLocalDate(this.model.get("date"));
            return this;
        },
        displayModal: function(modalType){
            switch(modalType){
                case 'reportExistsModal':
                    this.displayReportExistsModal();
                    break;
                case 'reportSubmittedModal':
                    this.displayReportSubmittedModal();
                    break;
                case 'reportUpdatedModal':
                    this.displayReportSubmittedModal();
                    break;
                case 'reportSubmitFailedModal':
                    this.displayReportSubmitFailedModal();
                    break;
            }
        },
        displayReportSubmittedModal: function(){
            var modalModel = new Modal({header:"Congrats!",footer:"",body:"The report was submitted successfully"});
            var modal = new ModalView({model:modalModel});
            this.addAlertView(modal);
            modal.show();
        },
        displayReportSubmitFailedModal: function(){
            var modalModel = new Modal({header:"Error",footer:"",body:"The report could not be submitted. Please try again"});
            var modal = new ModalView({model:modalModel});
            this.addAlertView(modal);
            modal.show();
        },
        displayReportUpdatedModal: function(){
            var modalModel = new Modal({header:"Congrats!",footer:"",body:"The report was updated successfully"});
            var modal = new ModalView({model:modalModel});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddExpendableInventoryItemModal: function(){
            // TODO
        },
        displayAddDoctorModal: function(msg){
            var names = msg.doctorNameString.split(" ");
            var addDoctorView = new AddDoctor({model: new Person({
                                                                    firstName:names[0],
                                                                    lastName:names[1],
                                                                    isActive:1,
                                                                    clinics:[this.model.get("clinic")],
                                                                    roles: [_.findWhere(roles().attributes,{name:'DOCTOR'})._id]
                                                                })});       
            var modalModel = new Modal({header:"Add Doctor",footer:"",body:addDoctorView.$el});
            var modal = new ModalView({model:modalModel});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddPersonModal: function(msg){
            var names = msg.personNameString.split(" ");
            var addPersonView = new AddPerson({model: new Person({
                                                                    firstName:names[0],
                                                                    lastName:names[1],
                                                                    isActive:1,
                                                                    clinics:[this.model.get("clinic")],
                                                                    //roles: [_.findWhere(roles().attributes,{name:'DOCTOR'})._id]
                                                                })});       
            var modalModel = new Modal({header:"Add Person",footer:"",body:addPersonView.$el});
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
                                                                     clinics:[this.model.get("clinic")],
                                                                     roles: [_.findWhere(roles().attributes,{name:'PATIENT'})._id]
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
           
        showView: function(viewType){

            // hide all views
            this.hideAllViews();
            this.activeViews[viewType].$el.show();
            this.selectedViewType = viewType;

        },
        refreshSelectedView: function(){
            if(this.selectedViewType !== null) {
                this.createAndRenderView(this.selectedViewType);
                this.activeViews[this.selectedViewType].$el.show();
            }
        },
        removeAllViews: function(){
            _.each(this.activeViews, function(value,key,list){
                value.close();  
            });
            this.activeViews = {};
            this.$('#content').html('');
        },
        addAlertView: function(view){
            if (this.currentAlertView){
              this.currentAlertView.close();
            }
         
            this.currentAlertView = view;
            this.currentAlertView.render();

            this.$("#alert").html(view.$el);             
        },
        createAndRenderView: function(viewType) {
            var self = this;
            if(!this.activeViews[viewType]) {
                switch(viewType){
                    case 'revenue':
                        this.activeViews[viewType] = new RevenueTableView({model: new RevenueRowList()});
                        break;
                    case 'patientsFeedback':
                        this.activeViews[viewType] = new PatientsFeedbackTableView({model: new PatientsFeedbackRowList()});
                        break; 
                    case 'clinicIssues':
                        this.activeViews[viewType] = new ClinicIssuesTableView({model: new ClinicIssuesRowList()});
                        break;     
                    case 'bankDeposits':
                        this.activeViews[viewType] = new BankDepositsTableView({model: new BankDepositsRowList()});
                        break;
                    case 'expenditure':
                        this.activeViews[viewType] = new ExpenditureTableView({model: new ExpenditureRowList()});
                        break;
                    case 'inventoryRequired':
                        this.activeViews[viewType] = new InventoryRequiredTableView({model: new InventoryRequiredRowList()});
                        break;
                } 

                this.activeViews[viewType].render();     
                this.$("#content").append(this.activeViews[viewType].$el);     
                this.activeViews[viewType].$el.hide();          

                switch(this.model.get('role')){
                    case _.findWhere(roles().attributes,{name:'DOCTOR'})._id:                        
                    case _.findWhere(roles().attributes,{name:'CONSULTANT'})._id:                        
                        break;
                    case _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id: 
                        this.activeViews[viewType].model.reset();
                        this.activeViews[viewType].model.addDataFromReport(this.model.get(viewType));
                        break;
                }
                
            } 
        },
        addView: function(ev) {
            ev.preventDefault();
            var viewType = ev.currentTarget.id;
            this.changeMenuSelection(viewType);
            this.createAndRenderView(viewType);  
            this.showView(viewType);          
        },
        handleSubmitClick: function(ev){
            ev.preventDefault();
              var modalModel = new Modal({header:"Submit Report",footer:(new Submit()).$el,body:"Phew! That was a lot of work! Well, looks like we're ready to submit! Do check if your inputs are correct before pressing the button."});
              var modal = new ModalView({model:modalModel});
              this.addAlertView(modal);
              modal.show();
        },
        handleLogoutClick: function(ev){
            ev.preventDefault();
             vent.trigger('CDF.Views.AppView:handleLogoutClick');
             router.index();
        },
        validateReport: function(){
            var result = true
            _.each(this.activeViews,function(element){

                if(!element.isValid()) result = false
            });
            return result;
        },
        submitReport: function(){
            var self = this;
            if(!this.validateReport()) {
                console.log('report has invalid entries. Not submitting');
                return;
            }
            var activeViewTypes = _.keys(this.activeViews);

            _.each(activeViewTypes,function(element){
                self.model.set(element,self.activeViews[element].model.getDataForReport());
            }); 

            this.model.save(this.model.attributes,{
                success: function(){
                    self.displayReportSubmittedModal();
                },
                error: function(){
                    self.displayReportSubmitFailedModal();
                }

            });
        }

    });

    function getInstance() {
        if(_instance === null) _instance = new AppView();
        return _instance;
    }


    return getInstance();

});