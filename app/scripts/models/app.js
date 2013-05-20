define(['backbone','underscore','jquery','vent'], function(Backbone,_,$,vent) {

    var Application = Backbone.Model.extend({
        url: 'http://192.168.211.132:8080/feedback',
        defaults: {
            personId:"",
            date: new Date(),
            userFullname: "",            
            clinicName: "",
            clinicId: "",
            roleId: "",
            clinics:[]
        },
        events: {
            //'change:date' : 'checkReportStatus'
        },
        initialize: function(){
           var self = this;
           
           this.listenTo(this,'change:date',this.checkReportStatus);
           this.listenTo(vent,'CDF.Views.AppView:click:submit',this.handSubmitByRole);
           this.listenTo(vent,'CDF.Collections.RevenueRowList:submitReport',this.processSuccessfulSubmissions);

        },
        onClose: function(){

        },
        submitReport: function(){
            var self = this;

            // save revenue 
            vent.trigger('CDF.Models.Application:submitReport', {date:this.get('date'),clinic:this.get('clinicId')});
            
            // save bank deposits 

            //....

        },
        processSuccessfulSubmissions: function(reportName){
            console.log(reportName+" report submitted successfully");

            if(/*all reports successfully submitted*/true){
                this.postReportStatus();    
             }
            
        },
        postReportStatus: function(){
            var self = this;
            this.save({},{
                success: function(model,response,options){
                 self.set('date', new Date());
                 console.log("report posted successfully");
                 vent.trigger("CDF.Models.Application:postReportStatus","success");
                },
                error: function(model, response,options){
                 console.log("report post error");
                 vent.trigger("CDF.Models.Application:postReportFailed","fail");
                }

            });
        },
        checkReportStatus: function(){
            var self = this;
            this.fetch({data:{date:this.get('date'),clinic:this.get('clinicId')},success: function(model, response, options){
                        
                if(response.length > 0 ) {
                    vent.trigger("CDF.Models.Application:checkReportStatus",true);
                } else {
                    vent.trigger("CDF.Models.Application:checkReportStatus",false);
                }
                    
            }});
        },
        handSubmitByRole: function(){
            switch(this.get('roleId')){
                case 0:
                    this.checkReportStatusAndSubmit();
                    break;
                case 1: 
                    this.updateReport();
                    break;
                default:
                    break; 
            }
        },
        checkReportStatusAndSubmit: function(){
            var self = this;

            
            this.fetch({data:{date:this.get('date'),clinic:this.get('clinicId')},success: function(model, response, options){
                        
                if(response.length > 0 ) {
                    vent.trigger('CDF.Models.Application:checkReportStatusAndSubmit:failed','reportExistsModal');

                    console.log("Not saving: today's report exists");
                } else {
                    self.submitReport();
                }
                    
            }});
        },
        updateReport: function() {

            this.submitReport();
        }


    });

    return Application;
});