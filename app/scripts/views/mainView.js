define(['backbone','jquery', 'underscore','models/app','views/app','vent'], function(Backbone,$,_,Application,AppView,vent){

    var mainView = Backbone.View.extend({
        el:  $('#main'),
        initialize: function(){
            this.listenTo(vent,'CDF.Router:index',this.addView);
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
        createAndAddAppView: function(authModel){
            var application = new Application();
                var person = authModel.get('person');
                application.set({

                    "clinicName":person.clinics[0].name,
                    "clinicId":person.clinics[0]._id,
                    "clinics":person.clinics,
                    "userFullname":person.firstName+" "+person.lastName,
                    "personId":person._id,
                    "date": new Date(),
                    "roleId":person.roles[0]._id,
            });

           var appView = new AppView({model: application});
           this.addView(appView);
        }


    });

    return mainView;

});