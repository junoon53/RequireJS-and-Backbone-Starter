define(['backbone','underscore','jquery','vent','models/people/roles'], function(Backbone,_,$,vent,roles) {
    var _instance = null;

    var Application = Backbone.Model.extend({
        url: 'http://192.168.211.132:8080/feedback',
        defaults: {
            // Report properties
            _id:null,            
            clinic: null,
            date: new Date(),

            // User properties
            person:null,
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
           this.listenTo(vent,'CDF.Collections.RevenueRowList:submitReport',this.processSuccessfulSubmissions);

        },
        onClose: function(){

        },
        
        processSuccessfulSubmissions: function(reportName){
            console.log(reportName+" report submitted successfully");

            if(/*all reports successfully submitted*/true 
            && this.get('role') !== _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id){
                this.postReportStatus();    
             } else if(/*all reports successfully submitted*/true) {
                vent.trigger("CDF.Models.Application:modifyReportStatus:success","reportUpdatedModal");
                console.log('report modified successfully');
             } else {
                vent.trigger("CDF.Models.Application:postReportStatus:failed","reportSubmitFailedModal");
                 console.log("report post error");
             }
            
        },
        postReportStatus: function(){
            var self = this;
            this.save({},{
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
                                    
            if(result) {
                vent.trigger("CDF.Models.Application:broadcastReportStatus:true",true);
            } else {
                vent.trigger("CDF.Models.Application:broadcastReportStatus:false",false);
            }                    
   
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