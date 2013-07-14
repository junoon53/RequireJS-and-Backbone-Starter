define(['backbone','underscore','jquery','utility','vent','config'], function(Backbone,_,$,utility,vent,config) {
    var _instance = null;

    var Issue = Backbone.Model.extend({
        url: config.serverUrl+'clinicIssue',
        defaults: {
        	_id: null,
        	id: null,
        	reportId:null,
            date: new Date(),
            dueDate: new Date(),
            issue: '',
			priority: 0,  
			status: 0,
			clinic: 0,
            doctor: {},
            doctorName: {},
            assignedTo: {},
            assignedToName: "",         
        },
        initialize: function(){
           var self = this;
            this.listenTo(this,'change:_id', this.set('id',this.get('_id')));
            this.listenTo(this,'change:doctor', this.set('doctorName',utility.toTitleCase(this.get('doctor').firstName + " " + this.get('doctor').lastName)));
            this.listenTo(this,'change:assignedTo', this.set('assignedToName',utility.toTitleCase(this.get('assignedTo').firstName + " " + this.get('assignedTo').lastName)));
       
        },
        onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
    });

    return Issue;
});