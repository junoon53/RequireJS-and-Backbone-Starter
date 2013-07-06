define([
    'backbone',
    'jquery', 
    'underscore',
    'models/formModels/utility/modal',
    'vent',
    'text!templates/modal.html'
    ], function(Backbone,$,_,ModalModel,vent,template){

    var Modal = Backbone.View.extend({
        model: new ModalModel(),
        header: "This is a Modal",
        footer: "",
        initialize: function(){
            var self = this;
            this.template = _.template(template);
            
            this.listenTo(this.$('#myModal'),'hidden',this.setVisibleFlag);
            this.listenTo(vent,'CDF.Views.FeedbackForm:click:submit', this.hide);
            this.listenTo(vent,'CDF.Views.People.AddDoctor:addDoctor:called', this.hide);
            this.listenTo(vent,'CDF.Views.People.AddPatient:addPatient:called', this.hide);
            this.listenTo(vent,'CDF.Views.People.AddPerson:addPerson:called', this.hide);
            this.listenTo(vent,'CDF.Views.InventoryRequired.AddExpendableInventoryItem:addExpendableInventoryItem:called', this.hide);
            this.listenTo(vent,'CDF.Views.InventoryReceived.AddExpendableInventoryItem:addExpendableInventoryItem:called', this.hide);
            this.listenTo(vent,'CDF.Views.InventoryReceived.AddPerson:addPerson:called', this.hide);
            this.listenTo(vent,'CDF.Views.Treatments.AddTreatmentStage:addTreatmentStage:called', this.hide);
            this.listenTo(vent,'CDF.Views.Treatments.AddTreatment:addTreatment:called', this.hide);
            this.listenTo(vent,'CDF.Models.FeedbackForm:submitReport:failed', this.hide);

            this.visible = false;            
        },
        setVisibleFlag: function(value){
            if(value) this.visible = value;           
                else {
                        this.visible = false;
                        this.$('#myModal').removeData('modal');
                        $("#myModal").remove();
                    }
                
        },
        onClose: function(){
            $("#myMmodal").remove();
            $('#myModal').data('modal', null);
        },
        show: function(){
            if(this.visible === false){
                this.$('#myModal').modal('show');
                this.visible = true;
            }            
        },
        hide: function(msg){
            this.$('#myModal').modal('hide');
            this.visible = false;
            vent.trigger('CDF.Views.Utility.Modal:hide',msg);
            this.remove();
        },
        render: function(){   

            this.$el.html(this.template({}));
            this.$('.modal-header').html(this.model.get("header"));
            this.$('.modal-body').html(this.model.get("body"));
            this.$('.modal-footer').html(this.model.get("footer"));
            this.$('#myModal').modal();   

            return this;
        },

    });

    return Modal;
});