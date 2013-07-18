define(['backbone','underscore','jquery','vent','models/formModels/people/roles','config'], function(Backbone,_,$,vent,roles,config) {
    var _instance = null;

    var FeedbackForm = Backbone.Model.extend({
        url: config.serverUrl+'report',
        defaults: {
            // Report properties
            _id:null,            
            id:null,            
            clinic: null,
            date: new Date(),
            submitted: false,

            revenue: [],
            bankDeposits: [],
            expenditure: [],
            patientsFeedback: [],
            clinicIssues: [],
            inventoryRequired:[],
            inventoryReceived:[],
            treatments: [],

            person: null,
 
            clinicName: "",            
            reportExists: false,

             clinics:[],
            
        },
        events: {
            //'change:date' : 'checkReportStatus'
        },
        initialize: function(){
           var self = this;
           
           this.listenTo(this,'change:date',this.handleDateOrClinicChange);
           this.listenTo(this,'change:clinic',this.handleDateOrClinicChange);
           this.listenTo(vent,'CDF.Views.AppView:click:submit',this.handleReportSubmitRequest);
           this.listenTo(vent,'CDF.Views.AppView:click:save',this.handleReportSaveRequest);

        },
        onClose: function(){

        },
        viewTypes: function() {
            return ['revenue','bankDeposits','expenditure','patientsFeedback',
                    'clinicIssues','inventoryRequired','inventoryReceived','treatments'];
        },
        resetReport: function(){
            this.set('_id',null);
            this.set('id',null);
            this.set('revenue',[]);
            this.set('bankDeposits',[]);
            this.set('expenditure',[]);
            this.set('patientsFeedback',[]);
            this.set('clinicIssues',[]);
            this.set('inventoryRequired',[]);
            this.set('inventoryReceived',[]);
            this.set('treatments',[]);
            this.set('person',null);
            vent.trigger("CDF.Models.FeedbackForm:resetReport");
        },
        handleDateOrClinicChange: function(){
            this.resetReport();
           /* switch(this.attributes.role){
                case _.findWhere(roles().attributes,{name:'DOCTOR'})._id:                        
                case _.findWhere(roles().attributes,{name:'CONSULTANT'})._id:  */
/*                    this.checkReportStatus(this.broadcastReportStatus);
                    break;
*/             // case _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id: 
            this.fetchReport(this.broadcastReportFetchResult); 
                 //   break;
           // }
        },
        checkReportStatus: function(callback){
            var self = this;
            $.get(config.serverUrl+'reportStatus',{date:this.get('date'),clinic:this.get('clinic')},function(data){
                if(data.reportExists) callback.call(self,true);
                else callback.call(self,false);
            });
        },
        fetchReport: function(callback){
            var self = this;
            this.fetch(

                {data:{date:this.get('date'),clinic:this.get('clinic')},

                success: function(model, response, options){
                    
                    model.set('id',model.get('_id'));
                    callback.call(self,true);
                },
                error: function(model, response,options){
                   callback.call(self,false);    
                   model.set("submitted",false);            
                },

            silent: true});
        },
        handleReportSubmitRequest: function(){
            this.checkReportStatus(this.sendSubmitMessageToView);
        },
        broadcastReportFetchResult: function(result){
            vent.trigger("CDF.Models.FeedbackForm:broadcastReportFetchResult",result );
        },
        broadcastReportStatus: function(result){           
            vent.trigger("CDF.Models.FeedbackForm:broadcastReportStatus",result );
        },
        sendSubmitMessageToView: function(result){
                                             
            if(result && this.get('submitted') && (this.get('role') !== _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id)) {
                vent.trigger('CDF.Models.FeedbackForm:submitReport:failed','reportExistsModal');
            } else if(result) {
                vent.trigger('CDF.Models.FeedbackForm:submitReport');
            } else if(!result){
                vent.trigger('CDF.Models.FeedbackForm:submitReport');
            }
        },
 
    });

    return FeedbackForm;
});