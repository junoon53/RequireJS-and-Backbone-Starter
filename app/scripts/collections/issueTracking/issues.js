define(['underscore','backbone','models/issueTracking/issue','vent','config'], function(_,Backbone,Issue,vent,config) {

	var Issues = Backbone.Collection.extend({
		model: Issue,
		url: config.serverUrl+'clinicIssues',
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);

	    },
	    priorityComparator :function(model) {
		  var priority = model.get("priority");
		  if(priority == "low") return 3;
		  if(priority == "medium") return 2;
		  if(priority == "high") return 1;
		  return 3;
		},
		statusComparator: function(model) {
		  var status = model.get("status");
		  if(status == "start") return 3;
		  if(status == "inProcess") return 2;
		  if(status == "pending") return 1;
		  if(status == "complete") return 0;
		  return 3;
		},
		getIncompleteIssues: function() {
			return _.reject(this.models,function(model){ return model.get('status') == 'complete' });
		},
	    onClose: function(){

	    },
	    fetchIssues: function(fromDate,toDate,clinic) {
	    	this.fetch({data:{fromDate:fromDate,toDate:toDate,clinic:clinic},success: function(model, response, options){
                        
                if(response) {
                    //model.set('id',model.get('_id'),{silent:true});
                    vent.trigger('Collections.IssueTracking.Issues:fetchIssues:success');
                    //callback.call(self,true);
                } else {
                   //callback.call(self,false);                           
                }
                    
            }});
	    }
	});

	return Issues;

});	