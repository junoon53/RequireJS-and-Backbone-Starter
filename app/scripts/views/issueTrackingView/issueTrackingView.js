define([

    'backbone',
    'jquery', 
    'underscore',
    
    'models/formModels/people/roles',

    'views/formViews/utility/modal',
    'views/formViews/utility/submit',
    'router/router',
    'vent',
    'text!templates/feedbackFormView.html',
    'text!templates/clinicsListRow.html',
    'datetimepicker',
         

    ], function(Backbone,$,_,
        FeedbackForm,
        roles,

        AddDoctor,
        AddPatient,
        AddPerson,
        AddExpendableInventoryItem,
        AddTreatmentStageView,

        RevenueTableView,
        BankDepositsTableView,
        ExpenditureTableView,
        PatientsFeedbackTableView,
        ClinicIssuesTableView,
        InventoryRequiredTableView,
        InventoryReceivedTableView,
        TreatmentsView,    

        ModalView,
        Submit,

        router,vent,template,clinicsListRowTemplate){

    var _instance = null;

    var FeedbackFormView  = Backbone.View.extend({
        model: new FeedbackForm(),
        events: {
            'click li#revenue': 'addView',
            'click li#bankDeposits': 'addView',
            'click li#expenditure': 'addView',
            'click li#patientsFeedback': 'addView',
            'click li#clinicIssues': 'addView',
            'click li#inventoryRequired': 'addView',
            'click li#inventoryReceived': 'addView',
            'click li#treatments': 'addView',
            'click li#submit a': 'showSubmitModal',
            'click li#save a': 'saveReport',
            'click .clinicsList li a': 'handleClinicSelect',
            'changeDate #datetimepicker' : 'handleDateChange'

        },
        initialize: function(){
            var self = this;
            this.model = new FeedbackForm();
            this.template = _.template(template);
            this.clinicsListRowTemplate = _.template(clinicsListRowTemplate);

            this.activeViews = {};
            this.selectedViewType = null;
            

            this.listenTo(vent,'CDF.Views.BankDeposits.BankDepositsRowView:addNewPerson', this.displayAddPersonModal);
            this.listenTo(vent,'CDF.Views.InventoryRequired.InventoryReceivedRowView:addNewPerson', this.displayAddExpendableInventoryItemModal);
            this.listenTo(vent,'CDF.Views.Expenditure.ExpenditureRowView:addNewPerson', this.displayAddPersonModal);

            this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.PatientsFeedback.PatientsFeedbackRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Treatments.CrownNBridgeRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Treatments.DenturesRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Treatments.ExtractionsRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Treatments.FillingsRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Treatments.RootCanalRowView:addNewPatient', this.displayAddPatientModal);
            this.listenTo(vent,'CDF.Views.Treatments.PerioRowView:addNewPatient', this.displayAddPatientModal);

            this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.ClinicIssues.ClinicIssuesRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.Treatments.CrownNBridgeRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.Treatments.DenturesRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.Treatments.ExtractionsRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.Treatments.FillingsRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.Treatments.RootCanalRowView:addNewDoctor', this.displayAddDoctorModal);
            this.listenTo(vent,'CDF.Views.Treatments.PerioRowView:addNewDoctor', this.displayAddDoctorModal);

            this.listenTo(vent,'CDF.Views.InventoryRequired.InventoryRequiredRowView:addNewExpendableInventoryItem', this.displayAddExpendableInventoryItemModal);
            this.listenTo(vent,'CDF.Views.InventoryRequired.InventoryReceivedRowView:addNewExpendableInventoryItem', this.displayAddExpendableInventoryItemModal);

            this.listenTo(vent,'CDF.Views.Treatments.CrownNBridgeRowView:addNewTreatmentStage', this.displayAddTreatmentStageModal);
            this.listenTo(vent,'CDF.Views.Treatments.DenturesRowView:addNewTreatmentStage', this.displayAddTreatmentStageModal);
            this.listenTo(vent,'CDF.Views.Treatments.RootCanalRowView:addNewTreatmentStage', this.displayAddTreatmentStageModal);

            this.listenTo(vent,'CDF.Views.Utility.Modal:hide', this.displayModal);
            this.listenTo(vent,'CDF.Models.FeedbackForm:submitReport:failed', this.displayModal);
            this.listenTo(vent,"CDF.Models.FeedbackForm:submitReport", this.submitReport);            
            this.listenTo(vent,"CDF.Models.FeedbackForm:broadcastReportFetchResult", this.addRetrievedViews);
            this.listenTo(vent,"CDF.Models.FeedbackForm:broadcastReportFetchResult", this.toggleReportSubmitPermission);
            this.listenTo(vent,"CDF.Models.FeedbackForm:broadcastReportFetchResult", this.updateReportStatusLabel);
            //this.listenTo(vent,"CDF.Models.Application:broadcastReportStatus", this.updateReportStatusLabel);

        },
        handleClinicSelect: function(ev){
            ev.preventDefault();
            var selectedClinicId = parseInt(ev.currentTarget.id,10);
            if(selectedClinicId !== this.model.get('clinic')) {
                this.model.set({clinic:selectedClinicId});
                this.model.set({clinicName:_.findWhere(this.model.get('clinics'),{_id:selectedClinicId}).name});
                this.$('span.selectedClinic').attr('id',this.model.get('clinic'));
                this.$('span.selectedClinic').text(this.model.get('clinicName'));  
                //this.removeAllViews(); 
            }                      
        },
        handleDateChange : function(ev) {
            ev.preventDefault();
            this.model.set("date",ev.localDate);
            this.dateTimePicker.hide();
            //this.removeAllViews();
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

            this.dateTimePicker.setLocalDate(new Date(this.model.get("date")));
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
            var modal = new ModalView();
            modal.model.set({header:"Congrats!",footer:"",body:"The report was submitted successfully"});
            this.addAlertView(modal);
            modal.show();
        },
        displayReportSubmitFailedModal: function(){
            var modal = new ModalView();
            modal.model.set({header:"Error",footer:"",body:"The report could not be submitted. Please try again"});
            this.addAlertView(modal);
            modal.show();
        },
        displayReportHasErrorsModal: function(){
            var modal = new ModalView();
            modal.model.set({header:"Report has invalid entries!",footer:"",body:"Please correct the invalid entries and try again."});
            this.addAlertView(modal);
            modal.show();
        },
        displayReportUpdatedModal: function(){
            var modal = new ModalView();
            modal.model.set({header:"Congrats!",footer:"",body:"The report was updated successfully"});
            this.addAlertView(modal);
            modal.show();
        },
        displayReportExistsModal: function(msg){
            var modal = new ModalView();
            modal.model.set({header:"Report Exists",footer:"",body:"A report for the selected date has already been submitted. Please choose a different date. To modify an earlier report, contact an administrator."});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddExpendableInventoryItemModal: function(msg){

            var addExpendableInventoryItemView = new AddExpendableInventoryItem();
            addExpendableInventoryItemView.model.set({
                genericName:msg.genericName
            });                                                                    
            addExpendableInventoryItemView.callback = msg.callback;
            var modal = new ModalView();
            modal.model.set({header:"Add Expendable Inventory Item",footer:"",body:addExpendableInventoryItemView.$el});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddDoctorModal: function(msg){
            var names = msg.doctorNameString.split(" ");
            var addDoctorView = new AddDoctor();     
            addDoctorView.model.set({ 
                firstName:names[0],
                lastName:names[1],
                isActive:1,
                clinics:[this.model.get("clinic")],
                roles: [_.findWhere(roles().attributes,{name:'DOCTOR'})._id]
            });
            addDoctorView.callback = msg.callback;
            addDoctorView.render();
            var modal = new ModalView();
            modal.model.set({header:"Add Doctor",footer:"",body:addDoctorView.$el});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddPersonModal: function(msg){
            var names = msg.personNameString.split(" ");
            var addPersonView = new AddPerson();
            addPersonView.model.set({
                firstName:names[0],
                lastName:names[1],
                isActive:1,
                clinics:[this.model.get("clinic")],
                roles: [_.findWhere(roles().attributes,{name:'STAFF'})._id]
            });
            addPersonView.callback = msg.callback;
            addPersonView.render();
            var modal = new ModalView();
            modal.model.set({header:"Add Person",footer:"",body:addPersonView.$el});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddPatientModal: function(msg){
            var names = msg.patientNameString.split(" ");
            var addPatientView = new AddPatient();
            addPatientView.model.set({
                 firstName:names[0],
                 lastName:names[1],
                 isActive:1,
                 clinics:[this.model.get("clinic")],
                 roles: [_.findWhere(roles().attributes,{name:'PATIENT'})._id]
            });
            addPatientView.callback = msg.callback;
            addPatientView.render();
            var modal = new ModalView();
            modal.model.set({header:"Add Patient",footer:"",body:addPatientView.$el});
            this.addAlertView(modal);
            modal.show();
        },
        displayAddTreatmentStageModal: function(msg){

            var addTreatmentStageView = new AddTreatmentStageView();

            addTreatmentStageView.model.set({
                stageName: msg.stageName,
                category: msg.category
            });

            addTreatmentStageView.callback = msg.callback;
            addTreatmentStageView.render();
            var modal = new ModalView();
            modal.model.set({header:"Add Treatment Stage",footer:"",body:addTreatmentStageView.$el});
            this.addAlertView(modal);
            modal.show();
        },
        showSubmitModal: function(ev){
            ev.preventDefault();
            if(ev.currentTarget.parentElement.className == "disabled") return; 

              var modal = new ModalView();
              modal.model.set({header:"Submit Report",footer:(new Submit()).$el,body:"Phew! That was a lot of work! Well, looks like we're ready to submit! Do check if your inputs are correct before pressing the button."});
              this.addAlertView(modal);
              modal.show();
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
        toggleReportSubmitPermission: function(reportExists) {
            if(reportExists && this.model.get('submitted')) {
              switch(this.model.get('role')){
                case _.findWhere(roles().attributes,{name:'DOCTOR'})._id:                        
                case _.findWhere(roles().attributes,{name:'CONSULTANT'})._id:   
                    this.$('#submit').addClass('disabled');
                    this.$('#save').addClass('disabled');
                    console.log('disabled save & submit');
                    break;
                case _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id: 
                    this.$('#submit').addClass('disabled');
                    this.$('#save').removeClass('disabled');
                    // enable save & submit
                    console.log('enabled save & submit');
                    break;
                }

            } else {
                console.log('enabled save & submit');
                    this.$('#submit').removeClass('disabled');
                    this.$('#save').removeClass('disabled');
                // enable save & submit
            }
        },
        updateReportStatusLabel: function(reportExists) {
            if(reportExists) {
                this.$('.reportStatus').addClass('existing-report');
                this.$('.reportStatus').removeClass('new-report');
                this.$('.reportStatus').html("<i class='icon-circle'></i>Existing Report");
            }else {
                this.$('.reportStatus').removeClass('existing-report');
                this.$('.reportStatus').addClass('new-report');
                this.$('.reportStatus').html("<i class='icon-circle'></i>New Report");
            }
        },
        removeAllViews: function(){
            _.each(this.activeViews, function(value,key,list){
                value.close();  
            });
            this.activeViews = {};
            this.$('#feedbackFormContent').html('');
            this.$('.alert-error-global').hide();
        },
        addAlertView: function(view){
            if (this.currentAlertView){
              this.currentAlertView.close();
            }
         
            this.currentAlertView = view;
            this.currentAlertView.render();
            this.$("#feedbackFormAlert").html(view.$el);             
        },
        createAndRenderView: function(viewType) {
            var self = this;
            if(!this.activeViews[viewType]) {
                switch(viewType){
                    case 'revenue':
                        this.activeViews[viewType] = new RevenueTableView();
                        break;
                    case 'patientsFeedback':
                        this.activeViews[viewType] = new PatientsFeedbackTableView();
                        break; 
                    case 'clinicIssues':
                        this.activeViews[viewType] = new ClinicIssuesTableView();
                        break;     
                    case 'bankDeposits':
                        this.activeViews[viewType] = new BankDepositsTableView();
                        break;
                    case 'expenditure':
                        this.activeViews[viewType] = new ExpenditureTableView();
                        break;
                    case 'inventoryRequired':
                        this.activeViews[viewType] = new InventoryRequiredTableView();
                        break;
                    case 'inventoryReceived':
                        this.activeViews[viewType] = new InventoryReceivedTableView();
                        break;
                    case 'treatments':
                        this.activeViews[viewType] = new TreatmentsView({attributes:{role:this.model.get('role')}});
                        break;
                } 

                this.activeViews[viewType].render();     
                this.$("#feedbackFormContent").append(this.activeViews[viewType].$el);     
                this.activeViews[viewType].$el.hide();          

                switch(this.model.get('role')){
                    case _.findWhere(roles().attributes,{name:'DOCTOR'})._id:                        
                    case _.findWhere(roles().attributes,{name:'CONSULTANT'})._id:                        
                    case _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id: 
                        this.activeViews[viewType].reset();
                        this.activeViews[viewType].addDataFromReport(this.model.get(viewType));
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
        validateReport: function(){
            var result = true
            _.each(this.activeViews,function(element){

                if(!element.isValid()) {
                    //this.$('#'+)
                    result = false;
                }
            });

            return result;
        },
        submitReport: function(){

            if(!this.validateReport()) {
                console.log('report has invalid entries. Not submitting');
                //this.displayReportHasErrorsModal();
                this.$('.alert-error-global').show();
                return;
            } 

            this.$('.alert-error-global').hide();
            this.model.set('person',this.model.get('user'));
            this._saveReport(true);
        },
        saveReport: function(ev) {

            if(ev.currentTarget.parentElement.className == "disabled") return; 

            if(!this.validateReport()) {
                console.log('report has invalid entries. Not saving');
                //this.displayReportHasErrorsModal();
                this.$('.alert-error-global').show();
                return;
            }

            this.$('.alert-error-global').hide();
            this.model.set('person',this.model.get('user'));
            this._saveReport();
        },
        _saveReport: function(submit) {
            var self = this;
            

            this.model.viewTypes().forEach(function(prop){
                if(self.activeViews[prop])
                self.model.set(prop,self.activeViews[prop].getDataForReport());
            });

            if(submit)
                this.model.set('submitted', submit);

            this.model.save(this.model.attributes,{
                success: function(){
                    if(submit)
                        self._playSuccessCheckmarkAnimation(this.$('li#submit a'));
                    else {
                        self._playSuccessCheckmarkAnimation(this.$('li#save a'));
                    }
                    self.addRetrievedViews();
                    self.toggleReportSubmitPermission(true);
                },
                error: function(response1,response2,response3){
                    //self.displayReportSubmitFailedModal();
                    if(submit)
                        self._playFailureCheckmarkAnimation(this.$('li#submit a'));
                    else {
                        self._playFailureCheckmarkAnimation(this.$('li#save a'));
                    }
                }

            });
        },
        _playSuccessCheckmarkAnimation: function(element) {
            if(animating) return;
            var animating = true;
            var self = this;
            element.append('<i class="successCheckMark icon-ok"></i>');

            this.$('.successCheckMark').fadeOut(5000, function () {             
                    self.$('.successCheckMark').remove();
                    animating = false;
              });
        },
        _playFailureCheckmarkAnimation: function(element) {
            if(animating) return
            var animating = true;
            var self = this;
            element.append('<i class="successCheckMark icon-remove"></i>');

            this.$('.successCheckMark').fadeOut(5000, function () {             
                    self.$('.successCheckMark').remove();
                    animating = false;
              });
        }


    });

    /*function getInstance() {
        if(_instance === null) {
          _instance = new FeedbackFormView();
          _instance.render();  
        } 
        return _instance;
    }
*/

    return FeedbackFormView;

});