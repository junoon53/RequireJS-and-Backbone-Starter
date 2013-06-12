define(['backbone','underscore','jquery','vent','models/people/roles'], function(Backbone,_,$,vent,roles) {
    var _instance = null;

    var Application = Backbone.Model.extend({
        url: 'http://192.168.211.132:8080/report',
        defaults: {
            // Report properties
            _id:null,            
            id:null,            
            clinic: null,
            date: new Date(),
            revenue: [],
            bankDeposits: [],
            expenditure: [],
            patientsFeedback: [],
            clinicIssues: [],
            inventoryRequired:[],
            inventoryReceived:[],
            treatments: [],

            person: null,

            // User properties
            user:null,
            role: "",
            clinics:[],

            // Properties for display
            userFullname: "",            
            clinicName: "",            
            roleName:""
            
        },
        events: {
            //'change:date' : 'checkReportStatus'
        },
        initialize: function(){
           var self = this;
           
           this.listenTo(this,'change:date',this.checkReportStatus);
           this.listenTo(this,'change:clinic',this.checkReportStatus);
           this.listenTo(vent,'CDF.Views.AppView:click:submit',this.checkReportStatusAndSubmit);

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
        },
        postReportStatus: function(){
            var self = this;
            this.save(this.model.attributes,{
                success: function(model,response,options){
                 self.set('date', new Date());
                 console.log("report posted successfully");
                 vent.trigger("CDF.Models.Application:postReportStatus:success","reportSubmittedModal");
                },
                error: function(model, response,options){
                 console.log("report post error");
                 vent.trigger("CDF.Models.Application:postReportStatus:failed","reportSubmitFailedModal");
                }

            });
        },
        getExistingReport: function(callback){
            var self = this;
            this.fetch({data:{date:this.get('date'),clinic:this.get('clinic')},success: function(model, response, options){
                        
                if(response) {
                    model.set('id',model.get('_id'));
                    callback.call(self,true);
                } else {
                   callback.call(self,false);                   
                }
                    
            },silent: true});
        },
        checkReportStatus: function(){
            this.getExistingReport(this.broadcastReportStatus);
        },
        checkReportStatusAndSubmit: function(){
            this.getExistingReport(this.checkRoleAndSubmit);
        },
        broadcastReportStatus: function(result){
                                    
            if(!result) {
                this.resetReport();
            } 

            vent.trigger("CDF.Models.Application:broadcastReportStatus",result );

   
        },
        checkRoleAndSubmit: function(result){
                                             
            if(result &&  (this.get('role') !== _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id)) {
                vent.trigger('CDF.Models.Application:submitReport:failed','reportExistsModal');
                console.log("Not saving: today's report exists");
            } else if(result) {
                console.log('Report exists: Saving modified report as ADMINISTRATOR');
                vent.trigger('CDF.Models.Application:submitReport');
            } else if(!result){
                console.log('Saving NEW report');
                this.set('person',this.get('user'));
                vent.trigger('CDF.Models.Application:submitReport');
            }
        },
 
    });

    function getInstance() {
        if(_instance === null) _instance = new Application();
        return _instance;
    }

    return getInstance();
});