define([

    'backbone',
    'jquery', 
    'underscore',
    'utility',
    
    'collections/inventoryRecords/expendableInventoryItems',
    'models/inventoryRecords/expendableInventoryRecords',
    'models/formModels/people/roles',
    'views/inventoryRecords/inventoryRecordsRow',
    'views/loading',
    'vent',
    'text!templates/inventoryRecordsView.html',
    'text!templates/clinicsListRow.html',
    'text!templates/inventoryRecordsRow.html',
    'text!templates/loading.html',

    ], function(Backbone,$,_,utility,
        InventoryRecordsCollection,
        InventoryRecordsModel,
        roles,
        ExpendableInventoryRecordRow,
        Loading,
        vent,
        template,
        clinicsListRowTemplate,
        rowTemplate,
        loadingTemplate){

    var _instance = null;

    var InventoryRecordsView  = Backbone.View.extend({
        model: new InventoryRecordsModel(),
        collection: new InventoryRecordsCollection(),
        events: {
            'click .clinicsList li a': 'handleClinicSelect',
            'click li#refresh a': 'handleRefresh',
            'keypress .inventoryItemSearch': 'handleKeyPress',
            'click li.prevPage a' : 'fetchPrevPage',
            'click li.nextPage a' : 'fetchNextPage'
        },
        initialize: function(){
            var self = this;
            this.model = new InventoryRecordsModel();
            this.collection = new InventoryRecordsCollection();
            this.template = _.template(template);
            this.rowTemplate = _.template(rowTemplate);
            this.clinicsListRowTemplate = _.template(clinicsListRowTemplate);

            this.rowViews = [];

            this.listenTo(this.collection,'reset' , this.removeAllRowViews); 
            this.listenTo(vent,'Collections.InventoryRecords.ExpendableInventoryItems:fetchItems:success',this.populateTable);
        },
        handleKeyPress: function(ev){
            if (ev.keyCode === 13){
                this.model.set('searchString',this.$('.inventoryItemSearch').val());
                this.handleRefresh();
            }
        },
        fetchPrevPage: function() {
            var currentPgNo = this.model.get('pgNo');
            if(currentPgNo <= 1) return;
            this.model.set('pgNo',this.model.get('pgNo')-1);
            this.populateTable();
        },
        fetchNextPage: function() {
            var currentPgNo = this.model.get('pgNo');
            if(currentPgNo >= this.model.get('totalResults')/this.model.get('itemsPerPage')) return;
            if(currentPgNo+1 > this.collection.models.length/this.model.get('itemsPerPage')) {
                this.model.set('pgNo',this.model.get('pgNo')+1);
                this.disablePagingButtons();
                this.fetchInventoryRecords();
            }else {
                this.model.set('pgNo',this.model.get('pgNo')+1);
                this.populateTable();
            }
            
        },
        updatePagingButtons: function() {
            var currentPgNo = this.model.get('pgNo');
            var totalPages = Math.ceil(this.model.get('totalResults')/this.model.get('itemsPerPage'));
            this.$('.prevPage').removeClass('disabled');
            this.$('.nextPage').removeClass('disabled');
            this.$('.pageIndicator a').html(currentPgNo+"/"+totalPages)
            if(currentPgNo==1) this.$('.prevPage').addClass('disabled');
            if(currentPgNo>=totalPages) this.$('.nextPage').addClass('disabled');
        },
        disablePagingButtons: function() {
            this.$('.prevPage').removeClass('disabled');
            this.$('.nextPage').removeClass('disabled');
            this.$('.prevPage').addClass('disabled');
            this.$('.nextPage').addClass('disabled');
        },
        fetchInventoryRecords: function() {
            this.collection.fetchItems(this.model.get('searchString'),this.model.get('clinic'),this.model.get('lastId'),this.model.get('itemsPerPage'));
        },
        handleClinicSelect: function(ev){
            ev.preventDefault();
            var selectedClinicId = parseInt(ev.currentTarget.id,10);
            if(selectedClinicId !== this.model.get('clinic')) {
                this.model.set({clinic:selectedClinicId});
                this.model.set({clinicName:_.findWhere(this.model.get('clinics'),{_id:selectedClinicId}).name});
                this.$('span.selectedClinic').attr('id',this.model.get('clinic'));
                this.$('span.selectedClinic').text(this.model.get('clinicName'));  
                this.handleRefresh();
            }                      
        },
        handleRefresh: function(ev) {
            if(ev) ev.preventDefault();
            this.collection.reset();
            this.model.set('pgNo',1);
            this.model.set('lastId',0);
            this.disablePagingButtons();
            this.fetchInventoryRecords();
            this.showLoadingGif();
        }, 
        onClose: function(){
            this.removeAllRowViews();
        },
        populateTable: function(totalResults) {
            if(totalResults) this.model.set('totalResults',totalResults);
            var pgNo = this.model.get('pgNo');
            var self = this;
            var models =  this.collection.models.slice((pgNo-1)*this.model.get('itemsPerPage'),(pgNo)*this.model.get('itemsPerPage'));
            this.$('.inventoryRecordsTableBody').html('');
            models.forEach(function(model){self.addRow(model)});
            this.model.set('lastId',this.collection.models[this.collection.models.length -1].get('_id')); 
            this.updatePagingButtons();           
        },
        addRow: function(rowModel){     

            var rowView = new ExpendableInventoryRecordRow({model: rowModel});
            rowView.render();               

            this.rowViews.push(rowView);
            this.$('.inventoryRecordsTableBody').append((rowView.$el));
        },
        removeAllRowViews: function() {
            
             _.each(this.rowViews,function(element,index,data){
                element.close();
                element = null;               
            }); 
        },
        render: function(){
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));   
          
            var clinicsList = "";
            _.each(this.model.get('clinics'),function(element,index,array){
                clinicsList += self.clinicsListRowTemplate({clinicName:element.name,clinic:element._id});
            });

            this.$('.clinicsList').html(clinicsList);  

            this.showLoadingGif();

            return this;
        },
        showLoadingGif: function() {
            this.$(".inventoryRecordsTableBody").html(Loading.$el);
        },

    });

    return InventoryRecordsView;

});