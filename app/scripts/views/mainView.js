define(['backbone','jquery', 'underscore','models/app','views/app','views/auth','models/auth','vent'], function(Backbone,$,_,application,appView,authView,auth,vent){
    var _instance = null;

    var MainView = Backbone.View.extend({
        el:  $('#main'),
        initialize: function(){
            this.listenTo(vent,'CDF.Router:index',this.addAuthView);
            this.listenTo(vent,'CDF.Models.Auth:login:success',this.createAndAddAppView);
        },
        addView: function(view){
            if (this.currentView){
              this.currentView.close();
            }
         
            this.currentView = view;
            this.currentView.render();
         
            this.$el.html(this.currentView.el);
        },
        addAuthView: function() {
            this.addView(authView);
        },
        createAndAddAppView: function(){
                var person = auth.get('person');
                application.set({

                    "clinicName":person.clinics[0].name,
                    "clinic":person.clinics[0]._id,
                    "clinics":person.clinics,
                    "userFullname":person.firstName+" "+person.lastName,
                    "person":person._id,
                    "date": new Date(),
                    "role":person.roles[person.roles.length - 1]._id,
                    "roleName":person.roles[person.roles.length - 1].name,
            });

           appView.model = application;
           this.addView(appView);
        }


    });

    function getInstance() {
        if(_instance === null) _instance = new MainView();
        return _instance;
    }

    return getInstance();

});