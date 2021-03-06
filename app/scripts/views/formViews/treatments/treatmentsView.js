define([
	'backbone',
	'jquery', 
	'underscore',
    
    'models/formModels/people/roles',

	'models/formModels/treatments/treatmentsViewModel',
	'views/formViews/treatments/extractionsTable',
    'views/formViews/treatments/fillingsTable',
    'views/formViews/treatments/crownNBridgeTable',
    'views/formViews/treatments/rootCanalTable',
    'views/formViews/treatments/denturesTable',
    'views/formViews/treatments/consultationTable',
    'views/formViews/treatments/perioTable',
    'views/formViews/treatments/implantsTable',
	'views/formViews/treatments/miscTable',
	'vent',
	'text!templates/treatmentsView.html'
	], function(Backbone,$,_,

	    roles,

    	TreatmentsViewModel,
		ExtractionsTable,
		FillingsTable,
        CrownNBridgeTable,
        RootCanalTable,
        DenturesTable,
        ConsultationTable,
        PerioTable,
        ImplantsTable,
        MiscTable,

		vent,template){

	var TreatmentsView = Backbone.View.extend({
		model: new TreatmentsViewModel(),
	    events: {
            'click li#consultation': 'handleTopMenuClick',
            'click li#extractions': 'handleTopMenuClick',
            'click li#fillings': 'handleTopMenuClick',
            'click li#rootCanal': 'handleTopMenuClick',
            'click li#crownNBridge': 'handleTopMenuClick',
            'click li#dentures': 'handleTopMenuClick',
            'click li#perio': 'handleTopMenuClick',
            'click li#implants': 'handleTopMenuClick',
            'click li#misc': 'handleTopMenuClick',
	    },
		initialize: function() {
			this.template = _.template(template);

            this.activeTables = {};
            this.selectedTableType = null;

		},
        changeMenuSelection: function(selection) {
            this.$('ul.nav-pills li').each(function(index){
                $(this).removeClass('active');
            })

            if(selection) {
                this.$('ul.nav-pills li#'+selection).attr("class","active");               
            }             
        },
        createAndRenderTable: function(tableType) {
            var self = this;
            if(!this.activeTables[tableType]) {
                switch(tableType){
                    case 'consultation':
                        this.activeTables[tableType] = new ConsultationTable();
                        break;
                    case 'extractions':
                        this.activeTables[tableType] = new ExtractionsTable();
                        break;
                    case 'fillings':
                        this.activeTables[tableType] = new FillingsTable();
                        break;
                    case 'rootCanal':
                        this.activeTables[tableType] = new RootCanalTable();
                        break;
                    case 'crownNBridge':
                        this.activeTables[tableType] = new CrownNBridgeTable();
                        break;
                    case 'dentures':
                        this.activeTables[tableType] = new DenturesTable();
                        break;
                    case 'perio':
                        this.activeTables[tableType] = new PerioTable();
                        break;
                    case 'implants':
                        this.activeTables[tableType] = new ImplantsTable();
                        break;
                    case 'misc':
                        this.activeTables[tableType] = new MiscTable();
                        break;
                } 

                this.activeTables[tableType].render();     
                this.$("#tables-container").append(this.activeTables[tableType].$el);     
                this.activeTables[tableType].$el.hide();          

                switch(this.attributes.role){
                    case _.findWhere(roles().attributes,{name:'DOCTOR'})._id:                        
                    case _.findWhere(roles().attributes,{name:'CONSULTANT'})._id:                        
                    case _.findWhere(roles().attributes,{name:'ADMINISTRATOR'})._id: 
                        this.activeTables[tableType].model.reset();
                        this.activeTables[tableType].model.addDataFromReport(this.model.get('treatments'));
                        break;
                }
            } 
        },
        reset: function(){
            _.each(this.activeTables,function(elements,index,data){
                element.model.reset();
            });
        },
		onClose: function(){
            _.each(this.activeTables,function(element,index,data){
                element.close();
                element = null;               
            });    
		},
		handleTopMenuClick: function(ev) {
			ev.preventDefault();
            this.changeMenuSelection(ev.currentTarget.id);
            this.addTable(ev.currentTarget.id);
            this.showTable(ev.currentTarget.id);
		},
        addTable: function(tableType) {
            this.createAndRenderTable(tableType);  
        },
        showTable: function(tableType){

            // hide all Tables
            this.hideAllTables();
            this.activeTables[tableType].$el.show();
            this.selectedTableType = tableType;
        },
        hideAllTables: function(){

            _.each(this.activeTables,function(element,index,data){
                element.$el.hide();
            });    

        },
		isValid: function() {
    		var result = true;
            _.each(this.activeTables,function(element){
                if(!element.isValid()) result = false;
            });            
            return result;
        },	
		render: function() {

			var self = this;
			this.$el.html(this.template(this.model.toJSON()));	
			return this;
		},
        addDataFromReport: function(data){
            var self = this;
            this.model.set('treatments',data);
            _.each(this.model.tableTypes,function(tableType){
                self.addTable(tableType);
                if(tableType === self.selectedTableType) self.showTable(tableType);
            });
        },
        getDataForReport: function(){
            var data = [];
             _.each(this.activeTables,function(table){
                data = data.concat(table.model.getDataForReport());
            });
            return data;
        }
	});

	return TreatmentsView;

});